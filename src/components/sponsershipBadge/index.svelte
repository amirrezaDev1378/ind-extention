<!-- SponsorshipBadge.svelte -->
<script lang="ts">
    import { CompanyInfoDialogStore } from "@/components/companyInfo/store";

    export let kvnID: string;
    export let companyName: string;
    export let label: string;
    console.log({kvnID});
    function openDialog() {
        CompanyInfoDialogStore.set({
            isOpen: true,
            companyInfo: {
                fullName: companyName,
                kvnID,
            }
        });
    }
</script>


<button class=" text-neutral-900 bg-green-300 p-3 rounded-lg relative z-[999999] cursor-pointer" on:click={openDialog}>
    {label}
</button>
