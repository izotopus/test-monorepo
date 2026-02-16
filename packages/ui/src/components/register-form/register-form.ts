import { html, css, unsafeCSS } from 'lit';
import { AstroLitElement } from '@shared/ui/base/AstroLitElement';
import { customElement, state } from 'lit/decorators.js';
import { registerSchema, type RegisterFormData } from '@shared/types';

import '@shared/ui/atom/ui-input';
import '@shared/ui/atom/ui-password';
import '@shared/ui/atom/field-error';

import baseStyles from '@shared/ui/styles/tailwind-base.css?inline';

@customElement('register-form')
export class RegisterForm extends AstroLitElement {
  @state() private formData: Partial<RegisterFormData> = {};

  @state() private errors: Record<string, string> = {};

  static styles = [unsafeCSS(baseStyles)];

  validate() {
    const result = registerSchema.safeParse(this.formData);
    
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      const newErrors: Record<string, string> = {};
      
      for (const key in fieldErrors) {
        newErrors[key] = fieldErrors[key]?.[0] || '';
      }
      this.errors = newErrors;
      return false;
    }

    this.errors = {};
    return true;
  }
  
  private handleInput(field: string, value: string) {
    this.formData = { ...this.formData, [field]: value };

    if (Object.keys(this.errors).length > 0) {
      this.validate();
    }

    this.dispatchEvent(new CustomEvent('form-change', {
      detail: this.formData, bubbles: true, composed: true
    }));
  }

  /* private handleSubmit(e: Event) {
    e.preventDefault();
    
    const isValid = this.validate();
    
    if (isValid) {
      this.dispatchEvent(new CustomEvent('form-submit', {
        detail: this.formData,
        bubbles: true,
        composed: true
      }));
    }
  } */
  
  async processRegistration() {
    console.log('API Call with:', this.formData);
    return new Promise(resolve => setTimeout(resolve, 2000));
  }

  render() {
    return html`
      <form
        x-data="{ 
          submitted: false, 
          loading: false,
          get host() { return $el.getRootNode().host },
        }"
        @submit="${(e: Event) => e.preventDefault()}"
        class="space-y-4"
      >
        <div 
          x-show="submitted" 
          x-transition:enter="transition-pop"
          x-transition:enter-start="pop-start"
          x-transition:enter-end="pop-end"
          class="mb-4 p-6 text-center bg-green-50 rounded-xl border border-green-200"
        >
          <h3 class="text-green-800 font-bold text-xl">Dziękujemy!</h3>
          <p class="text-green-600 font-medium">Konto zostało utworzone pomyślnie.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-0">
          <field-error .message="${this.errors.firstName}">
            <ui-input 
              label="Imię" 
              placeholder="Jan"
              name="firstName"
              @ui-change="${(e: any) => this.handleInput('firstName', e.detail)}"
              .error="${!!this.errors.firstName}"
            />
          </field-error>
          
          <field-error .message="${this.errors.lastName}">
            <ui-input 
              label="Nazwisko" 
              placeholder="Kowalski"
              name="lastName"
              @ui-change="${(e: any) => this.handleInput('lastName', e.detail)}"
              .error="${!!this.errors.lastName}"
            />
          </field-error>
        </div>

        <field-error .message="${this.errors.email}" class="mb-0">
          <ui-input 
            label="Email" 
            type="email"
            placeholder="jan@kowalski.pl"
            name="email"
            @ui-change="${(e: any) => this.handleInput('email', e.detail)}"
            .error="${!!this.errors.email}"
          />
        </field-error>

        <div class="space-y-4 mb-0">
          <field-error .message="${this.errors.password || this.errors.repassword}">
            <ui-password 
              label="Hasło"
              name="password"
              @ui-change="${(e: any) => this.handleInput('password', e.detail)}"
              .error="${!!this.errors.password}"
            ></ui-password>

            <div class="mt-4">
              <ui-input 
                label="Powtórz hasło" 
                type="password"
                name="repassword"
                @ui-change="${(e: any) => this.handleInput('repassword', e.detail)}"
                .error="${!!this.errors.repassword}"
              />
            </div>
          </field-error>
        </div>

        <button
          type="submit"
          :class="loading ? 'opacity-70 cursor-wait' : 'hover:opacity-90 active:scale-[0.98]'"
          class="w-full mt-2 py-3 px-4 bg-custom-blue text-white font-semibold rounded-md shadow-sm transition-all duration-200 cursor-pointer border-none disabled:bg-gray-300"
          @click="
            if (!host.validate()) return; 
            loading = true; 
            host.processRegistration().then(() => { 
              submitted = true; 
              loading = false; 
            });
          "
        >
          <span x-show="!loading">Zarejestruj się</span>
          <span x-show="loading" class="flex items-center justify-center gap-2">
             Przetwarzanie...
          </span>
        </button>
      </form>
    `;
  }
}