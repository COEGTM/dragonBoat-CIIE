<template>
  <div>
    <div class="maskAll" v-show="loadingShow"></div>
    <!-- loading -->
    <div class="loading" v-show="loadingShow">
      <img class="loadIcon" src="../../static/img/images/loading.svg" alt="" />
      <img class="loadText" src="../../static/img/images/Vanilla-1s-280px.gif" alt="" />
    </div>
    <!--  loading end-->
    <!-- <a-layout id="components-layout-demo-top" class="layout">
      <a-layout-content style="padding: 0 30px">
        <a-breadcrumb style="margin: 30px 0">
          <img src="./../../static/img/images/logo1.png" alt="">
        </a-breadcrumb>
        <div>
          <a-row type="flex" justify="space-between">
            <a-col :span="4" class="cardBox" v-for="item in pageData" v-bind:key="item.id" @click="selectItem(item)">
              <a-card hoverable style="width: 240px">
                <img slot="cover" alt="example" src="../../static/img/images/zhangliang.jpg" />
              </a-card>
              <div class="loginName">
                <span>{{item.athlete_name}}</span>
                <span class="nameSpell">{{item.name_spell}}</span>
              </div>
            </a-col>
            <a-pagination v-model="pageIndex" :defaultPageSize="12" @change="onPageChange"
              @showSizeChange="onPageChange" :pageSize="12" :total="this.total" show-less-items />
          </a-row>
        </div>
      </a-layout-content>
    </a-layout> -->

    <div class="welcome">
      <video autoplay loop muted>
        <source src="./video.mp4" type="video/mp4" />
      </video>
      <button type="button" class="btn btn-primary startBtn" @click="startBtnFn">开始体验</button>
    </div>

    <div class="countDown-box" :style="countDownStyle">
      <div class="screen"></div>
      <div class="lines"></div>
      <div class="number" id="number">3</div>
    </div>

  </div>
</template>

<script>
  import { backUrl } from './../../config/http'
  //语音听写
  import IatRecorder from '../assets/js/IatRecorder'
  const iatRecorder = new IatRecorder();

  export default {
    name: "login",
    data() {
      return {
        newIp: '',
        athleteList: [],
        pageSizeOptions: ['2', '4', '6', '8'],
        pageIndex: 1,
        pageSize: 12,
        total: 0,
        pageData: [],
        athlete_id: {},
        loadingShow: false,

        /* add -- Jae */
        timer_nums: 3,
        timer_clock: null,
        countDownStyle: {
          display: "none"
        },
      };
    },
    created() {
      this.init(iatRecorder); //初始化语音
      this.loadingShow = true;
    },
    mounted() {
      this.getIpPort();
      this.getNameList();
      this.iatRecorderStart();
    },
    methods: {
      getIpPort() {
        // this.newIp = "http://" + window.location.hostname + ":9600";
        // this.newIp = "http://" + '10.124.19.228:9600';
        this.newIp = backUrl;
      },

      onPageChange(pageIndex, pageSize) {
        this.pagination(pageIndex, pageSize)
      },

      pagination(pageNo, pageSize) {
        let offset = (pageNo - 1) * pageSize;
        let array = this.athleteList;
        let pageData = (offset + pageSize >= array.length) ? array.slice(offset, array.length) : array.slice(offset, offset + pageSize);
        this.pageData = pageData;
      },

      getNameList() {
        // let _this = this;
        this.$axios
          .get(`${this.newIp}/athlete?has_record=true`)
          .then((res) => {
            if (res.data) {
              this.loadingShow = false;
              // _this.loadingShow = false;
              this.athleteList = res.data;
              this.total = this.athleteList.length
              this.onPageChange(this.pageIndex, this.pageSize)
            } else {
            }
          })
          .catch((error) => {
            this.errorInfo = error.message;
            this.openNotificationWithIcon("error");
          });
      },

      selectItem(value) {
        this.athlete_id = value;
        this.$emit('sendathleteid', this.athlete_id);  //向父组件传值
        this.$router.push({ path: '/board' })
        this.$parent.intoTrainPage();
        // this.$parent.startTrain();
      },

      //开始体验按钮
      startBtnFn() {
        this.iatRecorderStop();
        this.countDownShow();
        this.timer_clock = setInterval(this.doLoop, 1000);
      },

      //录音 iatRecorder初始化
      init(iatRecorder) {
        iatRecorder.onTextChange = (text) => {
          let pattern1 = /[\|\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?|\，|\。|\？|\：|\；|\、|\‘|\’|\“|\”|\·|\！]/g;
          // let pattern2 = /[\u9f99][\u821f][\u9f99][\u821f][\u5f00][\u59cb]/g;  //龙舟龙舟，开始
          let pattern2 = /[\u5f00][\u59cb]/g;  //开始
          if (text[text.length - 1] !== '。') {  //原始识别结束后会加上'。'，去掉最后一次的识别结果
            text = text.replace(pattern1, '');
            let isTrue = pattern2.test(text);
            if (isTrue) {
              this.iatRecorderStop();
              this.countDownShow();
              this.timer_clock = setInterval(this.doLoop, 1000);
              return
            }
          }
        }
      },

      //开始录音
      iatRecorderStart() {
        iatRecorder.start()
      },

      //结束录音
      iatRecorderStop() {
        iatRecorder.stop()
      },

      //倒计时
      doLoop() {
        this.timer_nums--;
        if (this.timer_nums > 0) {
          document.getElementById('number').innerHTML = this.timer_nums;
        } else {
          clearInterval(this.timer_clock); //清除js定时器
          this.timer_nums = 3; //重置时间
          this.countDownStyleChange();//倒计时
          this.selectItem(this.pageData[0]);//结束倒计时后进行页面跳转，先默认传第一条参
        }
      },

      //修改倒计时样式
      countDownShow() {
        this.countDownStyle.display = "flex";
        return this.countDownStyle;
      },
      countDownStyleChange() {
        this.countDownStyle.display = "none";
        return this.countDownStyle;
      },
    },
  };
</script>

<style scoped>
  #components-layout-demo-top .logo {
    width: 156px;
    height: 31px;
    line-height: 31px;
    background: url("../../static/img/images/logo.png") no-repeat;
    background-size: 100%;
    margin: 16px 24px 16px 0;
    float: left;
  }

  .welcome {
    position: fixed;
    width: 100%;
    height: 100%;
  }

  .welcome video {
    width: 100%;
    height: 100%;
  }

  .welcome button {
    position: fixed;
    width: 300px;
    height: 80px;
    z-index: 999;
    border-radius: 50px;
    font-size: 30px;
    bottom: 15%;
    left: 50%;
    margin-left: -150px;
  }

  /* 倒计时 */
  @import url("https://fonts.googleapis.com/css2?family=Roboto:wght@500&display=swap");

  .lines::before {
    content: "";
    top: 50%;
    transform: translatey(-50%);
    left: 0;
    height: 8px;
    background: #000;
    width: 100%;
    position: absolute;
  }

  .lines::after {
    content: "";
    top: 0;
    left: 50%;
    transform: translatex(-50%);
    width: 8px;
    background: #000;
    height: 100%;
    position: absolute;
  }

  .screen {
    clip-path: polygon(50% 50%, 50% 0, 100% 0, 100% 100%, 0 100%, 0 0, 50% 0);
    background: #e1e1e1;
    position: absolute;
    /* height: calc(100vh + 100vw);
    width: calc(100vh + 100vw); */


    height: 100%;
    width: 100%;


    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      clip-path: polygon(50% 50%, 50% 0, 100% 0, 100% 100%, 0 100%, 0 0, 50% 0);
    }

    12.5% {
      clip-path: polygon(50% 50%, 100% 0, 100% 0, 100% 100%, 0 100%, 0 0, 50% 0);
    }

    37.5% {
      clip-path: polygon(50% 50%, 100% 100%, 100% 100%, 100% 100%, 0 100%, 0 0, 50% 0);
    }

    62.5% {
      clip-path: polygon(50% 50%, 0 100%, 0 100%, 0 100%, 0 100%, 0 0, 50% 0);
    }

    87.5% {
      clip-path: polygon(50% 50%, 0 0, 0 0, 0 0, 0 0, 0 0, 50% 0);
    }

    100% {
      clip-path: polygon(50% 50%, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0);
    }
  }

  .lines {
    /* box-shadow: inset 0 0 5em 1em #000; */
    position: absolute;
    left: 0;
    width: 100vw;
    height: 100vh;
    left: 0;
  }

  .number {
    font-size: 18rem;
    position: relative;
  }

  .number::after,
  .number::before {
    content: "";
    border: #f7f7f7 solid 12px;
    border-radius: 50%;
    position: absolute;
  }

  .number::before {
    width: 480px;
    height: 480px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .number::after {
    width: 400px;
    height: 400px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .countDown-box {
    position: absolute;
    left: 0;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
    box-shadow: inset 0 0 5em 1em #000;
    background: #4f4f4f;
  }
</style>