<script lang="ts">
    import "@/app.css";
    import {CompanyInfoDialogStore} from "./store";
    import {Modal} from "flowbite-svelte";

    $: isOpen = $CompanyInfoDialogStore.isOpen;
    $: companyInfo = $CompanyInfoDialogStore.companyInfo;

    function handleOpenChange(open: boolean) {
        CompanyInfoDialogStore.update(s => ({...s, isOpen: open}));
    }
</script>


<Modal bind:open={isOpen} onclose={() => handleOpenChange(false)}>
    <h1 class="text-center w-full mt-3 !text-4xl !text-black">
        This company is on IND list ! 🎉
    </h1>
    <ul class="!text-neutral-700 mt-2 !text-2xl">
        <li>Company name: {companyInfo?.fullName || "N/A"}</li>
        <li>KvnID: {companyInfo?.kvnID || "N/A"}</li>
    </ul>

</Modal>
