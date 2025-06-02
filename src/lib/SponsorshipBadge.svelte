<!-- SponsorshipBadge.svelte -->
<script lang="ts">
    import { CompanyInfoDialogStore } from "./companyInfo/store";

    export let Percentage: number;
    export let companyName: string;
    export let label: string;

    function openDialog() {
        alert("Opening dialog for " + label);
        CompanyInfoDialogStore.set({
            isOpen: true,
            companyInfo: {
                fullName: label,
                kvnID: "1234",
                predictedName: "Example Company"
            }
        });
    }
</script>


<button style="padding: 20px; background-color: red" class="sponsorship-badge !bg-red-400 text-sm" on:click={openDialog}>
    {label}
</button>

<style>
    .sponsorship-badge {
        display: inline-block;
        background: #0073b1;
        color: white;
        padding: 4px 10px;
        border-radius: 20px !important;
        z-index: 9999;
        font-weight: bold;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        font-size: 14px;
        font-family: inherit;
        margin-left: 8px;
        cursor: pointer;
        position: relative;
        z-index: 999999;
    }
</style>
