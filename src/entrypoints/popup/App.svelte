<script lang="ts">
    import "../../app.css";
    import { GithubIcon, Linkedin , TrashIcon , PlusIcon } from "lucide-svelte";
    import { Toggle } from "flowbite-svelte";
    import { onMount } from "svelte";

    let enabled = false;
    let newWord = "";
    let highlightWords: string[] = [];

    // Load settings on mount
    onMount(async () => {
        enabled = await storage.getItem("local:extensionEnabled") === "true";
        const storedWords = await storage.getItem("local:highlightWords") as string;
        highlightWords = storedWords ? JSON.parse(storedWords || '') : [];
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
</script>

<main class="min-w-[500px]">
    <div class="p-3">
        <h1 class="text-2xl text-center">Netherlands and UK Visa Sponsorship Checker</h1>
        <p class="text-center text-sm text-gray-600">
            Check if a company is on

            <a
                    class="text-blue-500 hover:underline"
                    href="https://ind.nl/en/public-register-recognised-sponsors/public-register-regular-labour-and-highly-skilled-migrants"
                    target="_blank">IND list</a
            >
            to sponsor visas OR on UK visa sponsorship list
        </p>

        <div>
            <h3 class="text-sm text-center mt-4 mb-2">
                Settings (you need to refresh the page to apply changes) :
            </h3>

            <Toggle color="green" size="default" checked={enabled} onclick={handleToggle}>Enable extension</Toggle>
        </div>
        <div>
            <div class="mt-4">
                <p class="font-semibold mb-2 text-center">Highlight Words (Don't forget to refresh the page after adding words)</p>

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
