<script lang="ts">
    import "../../app.css";
    import {GithubIcon, Linkedin} from "lucide-svelte";
    import {Toggle} from "flowbite-svelte";
    import {onMount} from "svelte";

    let enabled = false;

    // Load setting on mount
    onMount(async () => {
        enabled = await storage.getItem("local:extensionEnabled") === "true";
        console.log({enabled}, await storage.getItem("local:extensionEnabled"));
    });

    function handleToggle() {
        enabled = !enabled;
        console.log("clicked");
        storage.setItem("local:extensionEnabled", enabled ? "true" : "false");
    }
</script>

<main>
    <div class="p-3">
        <h1 class="text-2xl text-center">Netherlands Visa Sponsorship Checker</h1>
        <p class="text-center text-sm text-gray-600">
            Check if a company is on

            <a
                    class="text-blue-500 hover:underline"
                    href="https://ind.nl/en/public-register-recognised-sponsors/public-register-regular-labour-and-highly-skilled-migrants"
                    target="_blank">IND list</a
            >
            to sponsor visas
        </p>

        <div>
            <h3 class="text-sm text-center mt-4 mb-2">
                Settings (you need to refresh the page to apply changes) :
            </h3>

            <Toggle color="green" size="default" checked={enabled} onclick={handleToggle}>Enable extension</Toggle>
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
