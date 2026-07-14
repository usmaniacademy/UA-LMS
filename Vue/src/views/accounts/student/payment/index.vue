<template>
	<StudentLayout>
		<b-col xl="9">
			<!-- Payment methods -->
			<b-card no-body class="bg-transparent border rounded-3 mb-4">
				<b-card-header class="bg-transparent border-bottom">
					<h3 class="mb-0">Payment methods</h3>
				</b-card-header>
				<b-card-body>
					<div class="text-center py-5 text-muted">
						<BIconCreditCard2Front class="fs-2 d-block mx-auto mb-2 opacity-50" />
						<p class="mb-1">No saved payment methods.</p>
						<p class="small mb-0">Your card is entered securely at checkout and handled by our payment
							provider — we never store card details on our own servers.</p>
					</div>
				</b-card-body>
			</b-card>

			<!-- Billing history -->
			<b-card no-body class="bg-transparent border rounded-3">
				<b-card-header class="bg-transparent border-bottom">
					<h3 class="mb-0">Billing history</h3>
				</b-card-header>
				<b-card-body>
					<div class="text-center py-5 text-muted">
						<BIconReceipt class="fs-2 d-block mx-auto mb-2 opacity-50" />
						<p class="mb-1">No billing history yet.</p>
						<p class="small mb-0">Payments for your enrolled courses will appear here.</p>
					</div>
				</b-card-body>
			</b-card>
		</b-col>
	</StudentLayout>
</template>
<script setup lang="ts">
import StudentLayout from '@/layouts/StudentLayout.vue';
import { BIconCreditCard2Front, BIconReceipt } from 'bootstrap-icons-vue';
</script>
