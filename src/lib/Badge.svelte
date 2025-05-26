<script lang="ts">
  export let label: string = 'Linkding Badge';
</script>

<div class="linkding-badge">
  {label}
</div>

<style>
.linkding-badge {
  position: fixed;
  top: 20px;
  right: 20px;
  background: #0073b1;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  z-index: 9999;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  font-size: 18px;
  font-family: inherit;
}
</style> 