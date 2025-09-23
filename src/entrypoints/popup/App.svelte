<script lang="ts">
    import "../../app.css";
    import {GithubIcon, Linkedin, PlusIcon, TrashIcon, XIcon} from "lucide-svelte";
    import {Button, Toggle} from "flowbite-svelte";
    import {onMount} from "svelte";
    import {fetchIndList} from "@/lib/fetchIndList";
    import {browser} from "@wxt-dev/browser";

    let enabled = false;
    let newWord = "";
    let highlightWords: string[] = [];
    let indList: { name: string; id: string }[] = [];
    let searchQuery = "";
    // Load settings on mount
    onMount(async () => {
        enabled = await storage.getItem("local:extensionEnabled") === "true";
        const storedWords = await storage.getItem("local:highlightWords") as string;
        highlightWords = storedWords ? JSON.parse(storedWords || "") : [];
        indList = await storage.getItem("local:indList") as { name: string; id: string }[];

    });

    function handleToggle() {
        enabled = !enabled;
        storage.setItem("local:extensionEnabled", enabled ? "true" : "false");
    }

    function addWord() {
        const trimmed = newWord.trim();
        if (trimmed && !highlightWords.includes(trimmed)) {
            highlightWords = [...highlightWords, trimmed];
            saveWords();
            newWord = "";
        }
    }

    function removeWord(word: string) {
        highlightWords = highlightWords.filter(w => w !== word);
        saveWords();
    }

    function saveWords() {
        storage.setItem("local:highlightWords", JSON.stringify(highlightWords));
    }

    async function invalidateAndReload() {
        await storage.removeItem("local:indList");
        fetchIndList().then(async () => {
            const tabs = await browser.tabs.query({active: true, currentWindow: true});
            if (tabs[0]?.id) {
                await browser.tabs.reload(tabs[0].id);
            }
        }).catch((e) => {
            alert(`Error: ${e.message}`);
            console.error("Failed to fetch IND list:", e);
        });
    }

    function clearSearch() {
        searchQuery = "";
    }

    $: filteredIndList = (() => {
        if (!searchQuery) return indList.slice(0, 25);
        const results = [];
        for (const item of indList) {
            if (item.name.toLowerCase().includes(searchQuery.toLowerCase())) {
                results.push(item);
                if (results.length === 25) break;
            }
        }
        return results;
    })();


</script>

<main class="min-w-[500px]">
    <div class="p-3">
        <h1 class="text-2xl text-center">Netherlands, UK And Canada Visa Sponsorship Checker</h1>
        <p class="text-center text-sm text-gray-600">
            Check if a company is on the IND list for visa sponsorship in the Netherlands, UK, and Canada.
        </p>

        <div>
            <h3 class="text-sm text-center mt-4 mb-2">
                Settings (you need to refresh the page to apply changes) :
            </h3>

            <Toggle color="green" size="default" checked={enabled} onclick={handleToggle}>Enable extension</Toggle>
        </div>
        <div>
            <div class="mt-4">
                <p class="font-semibold mb-2 text-center">Highlight Words (Don't forget to refresh the page after adding
                    words)</p>

                <div class="flex items-center gap-2 mb-3">
                    <input
                            class="border border-gray-300 p-2 rounded w-full"
                            placeholder="Add new word..."
                            bind:value={newWord}
                            on:keydown={(e) => e.key === 'Enter' && addWord()}
                    />
                    <button
                            class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                            on:click={addWord}
                    >
                        <PlusIcon/>
                    </button>
                </div>

                <ul class="space-y-1 max-h-40 overflow-auto border border-gray-200 rounded p-2 text-sm">
                    {#each highlightWords as word (word)}
                        <li class="flex justify-between items-center bg-gray-50 p-1 px-2 rounded">
                            <span>{word}</span>
                            <button
                                    class="text-red-500 hover:text-red-700 text-xs"
                                    on:click={() => removeWord(word)}
                            >
                                <TrashIcon/>
                            </button>
                        </li>
                    {/each}
                </ul>
            </div>


        </div>

        <div class="mt-6">
            <h3 class="text-sm font-semibold mb-2 text-center">Search IND List</h3>
            <div class="flex items-center gap-2 mb-3">
                <input
                        class="border border-gray-300 p-2 rounded w-full"
                        placeholder="Search company..."
                        bind:value={searchQuery}
                />
                {#if searchQuery}
                    <button
                            class="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
                            on:click={clearSearch}
                            aria-label="Clear search"
                    >
                        <XIcon/>
                    </button>
                {/if}
            </div>
            <ul class="space-y-1 max-h-40 overflow-auto border border-gray-200 rounded p-2 text-sm">
                {#if filteredIndList.length > 0}
                    {#each filteredIndList as company (company)}
                        <li class="p-1 px-2 rounded">
                            <p>
                                {company.name}
                            </p>
                            <i>{company.id}</i>
                        </li>
                    {/each}
                {:else}
                    <li class="text-gray-500 text-center">No results found.</li>
                {/if}
            </ul>
        </div>
        <div class="flex flex-row items-center justify-center  w-full mt-4 border border-neutral-200 rounded-lg p-3">
            <Button onclick={()=>invalidateAndReload()} color="orange">
                Invalided and reload companies list.
            </Button>
        </div>
        <div class="flex flex-row items-center justify-center gap-8 w-full mt-4 border border-neutral-200 rounded-lg p-3">

            <a href="https://github.com/amirrezaDev1378/ind-extention" target="_blank">
                <GithubIcon/>
            </a>
            <a href="https://www.linkedin.com/in/amirreza-h/" target="_blank">
                <Linkedin/>
            </a>
        </div>
    </div>
</main>
