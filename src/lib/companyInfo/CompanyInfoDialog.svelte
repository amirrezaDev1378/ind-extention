


<script lang="ts">
    import {CompanyInfoDialogStore} from "./store";
    import Dialog, { Title, Content, Actions } from '@smui/dialog';

    // Reactive references
    $: isOpen = $CompanyInfoDialogStore.isOpen;
    $: companyInfo = $CompanyInfoDialogStore.companyInfo;

    // Optional: run logic when dialog opens
    $: if (isOpen) {
        console.log("Dialog opened");
    }

    function handleOpenChange(open: boolean) {
        CompanyInfoDialogStore.update(s => ({...s, isOpen: open}));
    }
</script>
<style>
    /*@import "svelte-material-ui/bare.css";*/
</style>
<h1>fuck this shit </h1>

<p id="ass" class="">
    {isOpen && companyInfo?.fullName}
</p>

<Dialog open={isOpen}>
    <Title id="simple-title">Dialog Title</Title>
    <Content id="simple-content">Super awesome dialog body text?</Content>
</Dialog>
