<template>
    <div class="columns is-multiline">
        <div class="column is-12">
            <b-field label="Guía de Remisión">
            </b-field>
        </div>
        <template v-for="(guia, index) in value">
            <div class="column is-5" :key="index">
                <b-field :label="index == 0?'Serie-Numero':''">
                <b-input v-model="guia.serie_numero_guia" size="is-small"></b-input>
                </b-field>
            </div>
            <div class="column is-6" :key="index + '1'">
                <b-field :label="index == 0?'Tipo':''">
                <b-select size="is-small" expanded v-model="guia.codigo_tipo_guia" >
                    <option v-for="option in [{value: '09', text: 'GUÍA DE REMISIÓN REMITENTE' },{value: '31', text: 'GUÍA DE REMISIÓN TRANSPORTISTA' }]" 
                            :value="option.value" :key="option.text">
                    {{ option.text}}
                    </option>
                </b-select>
                </b-field>
            </div>
            <div class="column is-1" :key="index + '2'">
                <b-field :label="index == 0?'Borrar':''">
                    <a @click="deleteGuia(index)" class="button is-danger is-rounded is-small"><b-icon icon="delete"></b-icon></a>
                </b-field>
            </div>
        </template>
    </div>
</template>
<script>
export default {
    name: "agregar-guia-remi",
    props: ['value'],
    data() {
        return {

        }
    },
    methods: {
        deleteGuia(index) {
            this.$emit('borrarGuia', index)
        }
    }
}
</script>
