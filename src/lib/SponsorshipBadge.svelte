<script lang="ts">

  interface Props {
    Percentage: number
    companyName: string
    label: string
  }
const { label } = $props()

</script>

<div class="sponsorship-badge">
  {label}
</div>

<style>
.sponsorship-badge {
  display: inline-block;
  background: #0073b1;
  color: white;
  padding: 4px 10px;
  border-radius: 8px;
  z-index: 9999;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  font-size: 14px;
  font-family: inherit;
  margin-left: 8px;
}
</style>
