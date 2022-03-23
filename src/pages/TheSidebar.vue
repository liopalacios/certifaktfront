<template>    
    <b-menu class="appbarvertical">
        <b-menu-list>                                                       
            <b-menu-item  v-for="(item) in data" :active="item.expand" :icon="item.icon" :expanded="item.expand" :key="item.category">        
                <template slot="label" slot-scope="props">
                    {{ item.category }}
                    <b-icon class="is-pulled-right" :icon="props.expanded ? 'menu-down' : 'menu-up'"></b-icon>
                </template>
                <b-menu-item v-for="page in item.pages" :disabled="!hasAccess(page.roles)" tag="router-link" :icon="page.icon" :label="page.name" :to="page.path" :key="page.name"></b-menu-item>
            </b-menu-item>                        
                   
                    <!--<p  class="menu-label has-text-weight-bold"
                        :key="item.category">
                        {{ item.category }}
                    </p>-->
                    <!--<ul
                        class="menu-list"
                        :key="i"
                        style="margin-bottom: 2.5rem;">
                        <li v-if="hasAccess(page.roles)" v-for="page in item.pages" :key="page.name">
                            <router-link v-if="page.name" :to="page.path">
                                <span class="menu-text">{{ page.name }}</span>
                            </router-link>

                                submenu -->
                            <!--<template v-else>
                                <a role="button" @click="toggle">
                                    <b-icon
                                        icon="chevron-right"
                                        size="is-small"
                                        class="chevron-icon"
                                        :custom-class="isExpanded ? 'mdi-rotate-90' : ''"
                                    />
                                    <span class="menu-text">{{ page.category }}</span>
                                </a>
                                <ul :class="{ 'is-active': isExpanded }">
                                    <li
                                        v-for="page in page.pages"
                                        :key="page.name">
                                        <router-link :to="page.path">
                                            <span class="menu-text">{{ page.name }}</span>
                                            <b-tag v-if="page.isNew" type="is-success">New!</b-tag>
                                            <b-tag v-if="page.isUpdated" type="is-info">Updated</b-tag>
                                        </router-link>
                                    </li>
                                </ul>
                            </template>
                        </li>
                    </ul>-->                    
            
        </b-menu-list>
    </b-menu>    
</template>

<script>
  import {mapGetters} from 'vuex'

    export default {
        props: {
            data: Array
        },
        data() {
            return {
                isExpanded: true
                
            }
        },
      computed:{
        ...mapGetters({'user':'auth/getUser'}),
        typeUser(){
          return this.user.typeUser
        }
      },
        methods: {
            toggle() {
                this.isExpanded = !this.isExpanded
            },
            hasAccess(roles){
                return roles.find(ele=>ele == this.typeUser)
            },
            enviar(){
                alert("jgjgj")
            }
            
        }
    }
</script>
<style scoped>
.appbarvertical {
    width:250px
}
</style>