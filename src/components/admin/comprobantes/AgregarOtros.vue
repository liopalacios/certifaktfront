<template>
    <div class="columns is-multiline">
        <div class="column is-12">
            <b-field label="Otros">
            </b-field>
        </div>
        <template v-for="(otro, index) in value">
            <div class="column is-5" :key="index">
                <b-field :label="index == 0?'Campo':''">
                    <b-select size="is-small" expanded v-model="otro.campo">
                        <option value="" >
                            -- Seleccionar Otros --
                        </option>
                        <option v-for="(option, i) in getCompany.typeFields" :value="option.name" :key="i">
                            {{ option.name }}
                        </option>
                    </b-select>
                </b-field>
            </div>
            <div class="column is-6" :key="index + '1'">
                <b-field :label="index == 0?'Valor':''">
                    <b-input v-model="otro.valor" size="is-small"></b-input>
                </b-field>
            </div>
            <div class="column is-1" :key="index + '2'">
                <b-field :label="index == 0?'Borrar':''">
                    <a @click="deleteOtro(index)" class="button is-danger is-rounded is-small"><b-icon icon="delete"></b-icon></a>
                </b-field>
            </div>
        </template>
    </div>
</template>
<script>
import {
    mapGetters
  } from 'vuex'

export default {
    name: "agregar-otros",
    props: ['value'],
    data() {
        return {

        }
    },
    methods: {
        deleteOtro(index) {
            this.$emit('borrarOtro', index)
        }
    },
    computed: {
        ...mapGetters({'getCompany': 'auth/getCompany'}),
    }
}
</script>
