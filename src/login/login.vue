<template>
  <div>
    <div class="maskAll" v-show="loadingShow"></div>
      <!-- loading -->
      <div class="loading" v-show="loadingShow">
        <img class="loadIcon" src="../../static/img/images/loading.svg" alt="" />
        <img
          class="loadText"
          src="../../static/img/images/Vanilla-1s-280px.gif"
          alt=""
        />
      </div>
      <!--  loading end-->
    <a-layout id="components-layout-demo-top" class="layout">
      <a-layout-content style="padding: 0 30px">
        <a-breadcrumb style="margin: 30px 0">
          <img src="./../../static/img/images/logo1.png" alt="">
        </a-breadcrumb>
        <div>
          <a-row  type="flex" justify="space-between">
            <a-col :span="4" class="cardBox"  v-for="item in pageData" v-bind:key="item.id" @click="selectItem(item)">
              <a-card hoverable style="width: 240px" >
                <img
                  slot="cover"
                  alt="example"
                  src="../../static/img/images/zhangliang.jpg"
                />
              </a-card>
              <div class="loginName">
                <span>{{item.athlete_name}}</span>
              <span class="nameSpell">{{item.name_spell}}</span>
              </div>
            </a-col>
             <a-pagination v-model="pageIndex" :defaultPageSize="12" @change="onPageChange"	@showSizeChange="onPageChange" :pageSize="12" :total="this.total" show-less-items />
          </a-row>
        </div>
      </a-layout-content>
    </a-layout>
    
  </div>
</template>

<script>
export default {
  name: "login",
  data() {
    return {
      newIp:'',
      athleteList:[],     
      pageSizeOptions: ['2', '4', '6', '8'],
      pageIndex: 1,
      pageSize: 12,
      total: 0,
      pageData:[],
      athlete_id:{},
      loadingShow: false,
    };
    
  },
  created(){
    this.loadingShow = true;
  },
  mounted() {
    this.getIpPort();
    this.getNameList();
    
  },
  methods: {
    getIpPort(){
      this.newIp = "http://" + window.location.host + ":9600";
        // this.newIp =  "http://"+'10.124.19.228:9600';
    },
    onPageChange(pageIndex, pageSize){
       this.pagination(pageIndex,pageSize)
    },

    pagination(pageNo, pageSize) {
    var offset = (pageNo - 1) * pageSize;
    var array=this.athleteList;
    var pageData=(offset + pageSize >= array.length) ? array.slice(offset, array.length) : array.slice(offset, offset + pageSize);
    this.pageData=pageData;
    },

    getNameList() {
      var _this = this;
      this.$axios
        .get(`${_this.newIp}/athlete`)
        .then((res) => {
          if (res.data) {
            _this.loadingShow = false;
            this.athleteList = res.data;
             this.total=this.athleteList.length
    _this.onPageChange(this.pageIndex,this.pageSize)
          } else {
          }
        })
        .catch((error) => {
          _this.errorInfo = error.message;
          _this.openNotificationWithIcon("error");
        });
    },

    selectItem(value) {
      this.athlete_id = value;
      this.$emit('sendathleteid',this.athlete_id);
      this.$router.push({path:'/board'})
      this.$parent.startTrain();
    },
  },
};
</script>

<style scoped >
#components-layout-demo-top .logo {
  width: 156px;
  height: 31px;
  line-height: 31px;
  background: url("../../static/img/images/logo.png") no-repeat;
  background-size: 100%;
  margin: 16px 24px 16px 0;
  float: left;
}
</style>