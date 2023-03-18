<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  components: { SidebarItem, Logo },
  data(){
    return {
      routes:[]
    }
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    // routes() {
    //   return this.$router.options.routes
    // },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  async mounted() {
    const token = localStorage.getItem('token')
    console.log(token)
    const {data:res} = await this.$http.get('/emp/'+ token)
    console.log(res)
    if(res.data.position === '普通员工') {
      for(let i = 0 ; i < this.$router.options.routes.length ; i++){
        if(this.$router.options.routes[i].path === '/acl'){
          this.$router.options.routes[i].show = false
        }
      }
    }
    else if(res.data.position === '店长') {
      for(let i = 0 ; i < this.$router.options.routes.length ; i++){
        if(this.$router.options.routes[i].path === '/acl'){
          this.$router.options.routes[i].children[1].show = false
        }
      }
    }
    // console.log(this.$router.options.routes)
    this.routes=this.$router.options.routes
  }
}
</script>
