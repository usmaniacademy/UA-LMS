<template>
  <main>
    <section class="p-0 d-flex align-items-center position-relative overflow-hidden">
      <b-container fluid>
        <b-row>
          <b-col cols="12" lg="6"
            class="d-md-flex align-items-center justify-content-center bg-primary bg-opacity-10 vh-lg-100">
            <div class="p-4 p-lg-5 text-center">
              <img :src="uaLogo" class="img-fluid mb-4" style="max-width: min(440px, 100%);" alt="Usmani Academy">
              <p class="mb-0 h5 fw-light">Modern learning, rooted in Islamic values.</p>
            </div>
          </b-col>
          <b-col cols="12" lg="6" class="d-flex justify-content-center">
            <b-row class="my-5">
              <b-col sm="10" xl="12" class="m-auto">
                <span class="mb-0 fs-1">🤔</span>
                <h1 class="fs-2">Forgot Password?</h1>
                <h5 class="fw-light mb-4">To receive a new password, enter your email address below.</h5>
                <b-form>
                  <div class="mb-4">
                    <b-form-group label="Email address *">
                      <b-input-group size="lg">
                        <template #prepend>
                          <span class="input-group-text bg-light rounded-start border-0 text-secondary px-3">
                            <BIconEnvelopeFill />
                          </span>
                        </template>
                        <b-form-input type="email" class="border-0 bg-light rounded-end ps-1" placeholder="E-mail" />
                      </b-input-group>
                    </b-form-group>
                  </div>
                  <div class="align-items-center">
                    <div class="d-grid">
                      <b-button variant="primary" class="mb-0" type="button">Reset password</b-button>
                    </div>
                  </div>
                </b-form>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
      </b-container>
    </section>
  </main>
</template>
<script setup lang="ts">
import uaLogo from '@/assets/images/ua-logo-dark.png.png';
import { BIconEnvelopeFill } from 'bootstrap-icons-vue';
</script>