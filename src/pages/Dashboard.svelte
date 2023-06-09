<script lang="ts">
	import { user } from '../stores/auth';
</script>

<h1>Dashboard</h1>
<p>{$user?.emailVerified}</p>
