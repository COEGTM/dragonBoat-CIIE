<template>
  <div id="app" class="page">
    <router-view @sendathleteid="getathleteid"></router-view>
    <div :style="{ display: this.$route.path == '/board' ? 'block' : 'none' }">
      <div class="maskAll" v-show="loadingShow"></div>
      <!-- loading -->
      <div class="loading" v-show="loadingShow">
        <img class="loadIcon" src="./../static/img/images/loading.svg" alt="" />
        <img class="loadText" src="./../static/img/images/Vanilla-1s-280px.gif" alt="" />
      </div>
      <!--  loading end-->

      <!-- 个人战绩 -->
      <!-- <a-modal class="reportModal" v-model="report" :footer="null" :closable="false" :maskClosable="true"
        :keyboard="false" @cancel="handleCancel">
        <a-spin tip="Loading..." v-show="spinShow">
          <div class="spin-content">报告正在加载中，请稍后...</div>
        </a-spin>
        <a-descriptions class="reportBG" v-show="!spinShow">
          <a-descriptions-item label="动作质量评估">
            {{ summaryData.score }}
          </a-descriptions-item>
          <a-descriptions-item label="动作周期稳定性">
            {{ summaryData.stability }}
          </a-descriptions-item>
          <a-descriptions-item label="桨频">
            {{ summaryData.speed }}次/分
          </a-descriptions-item>
          <a-descriptions-item label="手部训练" :span="3">
            {{ summaryData.hand }}
          </a-descriptions-item>
          <a-descriptions-item label="肘部训练" :span="3">
            {{ summaryData.elbow }}
          </a-descriptions-item>
          <a-descriptions-item label="大臂训练" :span="3">
            {{ summaryData.arm }}
          </a-descriptions-item>
          <a-descriptions-item label="躯干训练" :span="3">
            {{ summaryData.torso }}
          </a-descriptions-item>
          <a-descriptions-item label="髋部训练" :span="3">
            {{ summaryData.hip }}
          </a-descriptions-item>
          <a-descriptions-item label="膝盖训练" :span="3">
            {{ summaryData.knee }}
          </a-descriptions-item>
        </a-descriptions>
      </a-modal> -->

      <div class="reportModal" v-show="report" @click="hideModalReport($event)">
        <div class="reportContain" ref="reportContain">
          <a-spin tip="Loading..." v-show="spinShow">
            <div class="spin-content">报告正在加载中，请稍后...</div>
          </a-spin>
          <div class="reportBg" v-show="!spinShow">
            <div class="list-head">
              <h3 class="score">{{summaryData.score}}</h3>
            </div>
            <div class="list">
              <li class="stability">
                <p>{{summaryData.stability}}</p>
              </li>
              <li class="hand">
                <p>{{summaryData.hand}}</p>
              </li>
              <li class="elbow">
                <p>{{summaryData.elbow}}</p>
              </li>
              <li class="arm">
                <p>{{summaryData.arm}}</p>
              </li>
              <li class="torso">
                <p>{{summaryData.torso}}</p>
              </li>
              <li class="hip">
                <p>{{summaryData.hip}}</p>
              </li>
              <li class="knee">
                <p>{{summaryData.knee}}</p>
              </li>
            </div>
          </div>
        </div>
      </div>
      <!-- 个人战绩 -->

      <!-- board -->
      <div style="margin: 0 20px">
        <a-row>
          <a-col class="head">
            <a-button class="stopTrainBtn" @click="stopTrain()">停止训练</a-button>
            <a-button class="stopTrainBtn" @click="startTrain()" v-if="stopBtnTxt == '再次训练'">再次训练</a-button>
            <a-button class="reportBtn" :disabled="stopBtnTxt !== '再次训练'" @click="ajaxUpdateRecord()">查看报告</a-button>
          </a-col>
        </a-row>
        <a-row type="flex" justify="space-around">
          <a-col :span="6" class="video">
            <img :src="videoFeed + ':60000/video_feed'" alt="" />
          </a-col>
          <!-- 最前端姿势 -->
          <a-col :span="16" class="front">
            <a-row type="flex" justify="center" class="frontWrap">
              <a-col :span="4" class="maskBox">
                <a-col :span="24" class="frontElbowWrapBox">
                  <img src="./../static/img/images/hand.png" alt="" />
                  <img class="redMask mask" src="./../static/img/images/red.png"
                    v-show="(frontPosture.hand.flag) && (frontPosture.hand.flag == 2)" />
                  <img class="orangeMask mask" src="./../static/img/images/orange.png"
                    v-show="(frontPosture.hand.flag) && (frontPosture.hand.flag == 1)" />
                </a-col>
                <a-col :span="24" class="dec">
                  <p>{{ frontPosture.hand.angle }}</p>
                  <p>{{ frontPosture.hand.description }}</p>
                </a-col>
              </a-col>
              <a-col :span="4" class="maskBox">
                <a-col :span="24">
                  <img src="./../static/img/images/elbow.png" alt="" />
                  <img class="redMask mask" src="./../static/img/images/red.png"
                    v-show="(frontPosture.elbow.flag) && (frontPosture.elbow.flag == 2)" />
                  <img class="orangeMask mask" src="./../static/img/images/orange.png"
                    v-show="(frontPosture.elbow.flag) && (frontPosture.elbow.flag == 1)" />
                </a-col>
                <a-col :span="24" class="dec">
                  <p>{{ frontPosture.elbow.angle }}</p>
                  <p>{{ frontPosture.elbow.description }}</p>
                </a-col>
              </a-col>
              <a-col :span="4" class="maskBox">
                <a-col :span="24">
                  <img src="./../static/img/images/arm.png" alt="" />
                  <img class="redMask mask" src="./../static/img/images/red.png"
                    v-show="(frontPosture.arm.flag) && (frontPosture.arm.flag == 2)" />
                  <img class="orangeMask mask" src="./../static/img/images/orange.png"
                    v-show="(frontPosture.arm.flag) && (frontPosture.arm.flag == 1)" />
                </a-col>
                <a-col :span="24" class="dec">
                  <p>{{ frontPosture.arm.angle }}</p>
                  <p>{{ frontPosture.arm.description }}</p>
                </a-col>
              </a-col>
              <a-col :span="4" class="maskBox">
                <a-col :span="24">
                  <img src="./../static/img/images/body.png" alt="" />
                  <img class="redMask mask" src="./../static/img/images/red.png"
                    v-show="(frontPosture.torso.flag) && (frontPosture.torso.flag == 2)" />
                  <img class="orangeMask mask" src="./../static/img/images/orange.png"
                    v-show="(frontPosture.torso.flag)&& (frontPosture.torso.flag == 1)" />
                </a-col>
                <a-col :span="24" class="dec">
                  <p>{{ frontPosture.torso.angle }}</p>
                  <p>{{ frontPosture.torso.description }}</p>
                </a-col>
              </a-col>
              <a-col :span="4" class="maskBox">
                <a-col :span="24">
                  <img src="./../static/img/images/hips.png" alt="" />
                  <img class="redMask mask" src="./../static/img/images/red.png"
                    v-show="(frontPosture.hip.flag) && (frontPosture.hip.flag == 2)" />
                  <img class="orangeMask mask" src="./../static/img/images/orange.png"
                    v-show="(frontPosture.hip.flag) && (frontPosture.hip.flag == 1)" />
                </a-col>
                <a-col :span="24" class="dec">
                  <p>{{ frontPosture.hip.angle }}</p>
                  <p>{{ frontPosture.hip.description }}</p>
                </a-col>
              </a-col>
              <a-col :span="4" class="maskBox">
                <a-col :span="24">
                  <img src="./../static/img/images/knee.png" alt="" />
                  <img class="redMask mask" src="./../static/img/images/red.png"
                    v-show="(frontPosture.knee.flag) && (frontPosture.knee.flag == 2)" />
                  <img class="orangeMask mask" src="./../static/img/images/orange.png"
                    v-show="(frontPosture.knee.flag) && (frontPosture.knee.flag == 1)" />
                </a-col>
                <a-col :span="24" class="dec">
                  <p>{{ frontPosture.knee.angle }}</p>
                  <p>{{ frontPosture.knee.description }}</p>
                </a-col>
              </a-col>
            </a-row>
          </a-col>
          <!-- 最前端姿势 -->
        </a-row>
        <a-row type="flex" justify="space-around">
          <!-- 划桨动作数据 -->
          <a-col :span="6" class="speed">
            <p class="zqwdx speedNum">{{ report ? "":summaryData.score }}</p>
            <div class="speedNum">
              <span class="dzwcsj">{{ report ? "":summaryData.speed }}</span>
              <span class="dzzlpgcj">{{ report ? "":summaryData.stability }}</span>
            </div>
          </a-col>
          <!-- 划桨动作数据 -->

          <!-- 最远端姿势 -->
          <a-col :span="16" class="back">
            <a-row type="flex" justify="center" class="backWrap">
              <a-col :span="4" class="maskBox">
                <a-col :span="24" class="frontElbowWrapBox">
                  <img class="normalMask" src="./../static/img/images/hand.png" alt="" />
                  <img class="redMask mask" src="./../static/img/images/red.png"
                    v-show="(backPosture.hand.flag) && (backPosture.hand.flag == 2)" />
                  <img class="orangeMask mask" src="./../static/img/images/orange.png"
                    v-show="(backPosture.hand.flag) && (backPosture.hand.flag == 1)" />
                </a-col>
                <a-col :span="24" class="dec">
                  <p>{{ backPosture.hand.angle }}</p>
                  <p>{{ backPosture.hand.description }}</p>
                </a-col>
              </a-col>
              <a-col :span="4" class="maskBox">
                <a-col :span="24">
                  <img src="./../static/img/images/elbow.png" alt="" />
                  <img class="redMask mask" src="./../static/img/images/red.png"
                    v-show="(backPosture.elbow.flag) && (backPosture.elbow.flag == 2)" />
                  <img class="orangeMask mask" src="./../static/img/images/orange.png"
                    v-show="(backPosture.elbow.flag) && (backPosture.elbow.flag == 1)" />
                </a-col>
                <a-col :span="24" class="dec">
                  <p>{{ backPosture.elbow.angle }}</p>
                  <p>{{ backPosture.elbow.description }}</p>
                </a-col>
              </a-col>
              <a-col :span="4" class="maskBox">
                <a-col :span="24">
                  <img src="./../static/img/images/arm.png" alt="" />
                  <img class="redMask mask" src="./../static/img/images/red.png"
                    v-show="(backPosture.arm.flag) && (backPosture.arm.flag == 2)" />
                  <img class="orangeMask mask" src="./../static/img/images/orange.png"
                    v-show="(backPosture.arm.flag) && (backPosture.arm.flag == 1)" />
                </a-col>
                <a-col :span="24" class="dec">
                  <p>{{ backPosture.arm.angle }}</p>
                  <p>{{ backPosture.arm.description }}</p>
                </a-col>
              </a-col>
              <a-col :span="4" class="maskBox">
                <a-col :span="24">
                  <img src="./../static/img/images/body.png" alt="" />
                  <img class="redMask mask" src="./../static/img/images/red.png"
                    v-show="(backPosture.torso.flag) && (backPosture.torso.flag == 2)" />
                  <img class="orangeMask mask" src="./../static/img/images/orange.png"
                    v-show="(backPosture.torso.flag) && (backPosture.torso.flag == 1)" />
                </a-col>
                <a-col :span="24" class="dec">
                  <p>{{ backPosture.torso.angle }}</p>
                  <p>{{ backPosture.torso.description }}</p>
                </a-col>
              </a-col>
              <a-col :span="4" class="maskBox">
                <a-col :span="24">
                  <img src="./../static/img/images/hips.png" alt="" />
                  <img class="redMask mask" src="./../static/img/images/red.png"
                    v-show="(backPosture.hip.flag) && (backPosture.hip.flag == 2)" />
                  <img class="orangeMask mask" src="./../static/img/images/orange.png"
                    v-show="(backPosture.hip.flag) && (backPosture.hip.flag == 1)" />
                </a-col>
                <a-col :span="24" class="dec">
                  <p>{{ backPosture.hip.angle }}</p>
                  <p>{{ backPosture.hip.description }}</p>
                </a-col>
              </a-col>
              <a-col :span="4" class="maskBox">
                <a-col :span="24">
                  <img class="normalMask" src="./../static/img/images/knee.png" alt="" />
                  <img class="redMask mask" src="./../static/img/images/red.png"
                    v-show="(backPosture.knee.flag) && (backPosture.knee.flag == 2)" />
                  <img class="orangeMask mask" src="./../static/img/images/orange.png"
                    v-show="(backPosture.knee.flag) && (backPosture.knee.flag == 1)" />
                </a-col>
                <a-col :span="24" class="dec">
                  <p>{{ backPosture.knee.angle }}</p>
                  <p>{{ backPosture.knee.description }}</p>
                </a-col>
              </a-col>
            </a-row>
          </a-col>
        </a-row>
      </div>
      <!-- board -->
    </div>
  </div>
</template>

<script>
  import login from "../src/login/login";
  // import { backUrl } from "./../config/http"
  import IatRecorder from './assets/js/IatRecorder'
  const iatRecorder = new IatRecorder();
  export default {
    components: {
      login,
    },
    name: "App",
    data() {
      return {
        newIp: '',
        videoFeed: '',
        ModalText: "",
        loadingShow: false,
        visible: false,
        report: false,
        confirmLoading: false,
        athleteList: [],
        addRecordForm: {
          athlete_id: "",
          category: "rowing",
        },
        record_id: "",
        updateRecordForm: {
          id: "",
          athlete_id: "",
          status: "done",
          category: "rowing"
        },
        summaryData: {
          //划桨动作数据
          stability: "", //动作周期稳定性
          speed: "", //动作完成时间
          score: "", //动作质量评估成绩
        },

        athleteInfo: {
          name: "",
          sex: "",
        },
        stopBtnTxt: "停止训练",
        errorInfo: "",
        frontPosture: {
          //最前端姿势
          elbow: {
            angle: "",
            flag: 0,
            description: "",
          },
          hand: {
            angle: "",
            flag: 0,
            description: "",
          },
          arm: {
            angle: "",
            flag: 0,
            description: "",
          },
          knee: {
            angle: "",
            flag: 0,
            description: "",
          },
          torso: {
            angle: "",
            flag: 0,
            description: "",
          },
          hip: {
            angle: "",
            flag: 0,
            description: "",
          },
        },

        backPosture: {
          //最后端姿势
          elbow: {
            angle: "",
            flag: 0,
            description: "",
          },
          hand: {
            angle: "",
            flag: 0,
            description: "",
          },
          arm: {
            angle: "",
            flag: 0,
            description: "",
          },
          knee: {
            angle: "",
            flag: 0,
            description: "",
          },
          torso: {
            angle: "",
            flag: 0,
            description: "",
          },
          hip: {
            angle: "",
            flag: 0,
            description: "",
          },
        },
        timer_reset: "",
        timer_resetSummy: "",
        updateFlag: "",
        spinShow: false,
      };
    },

    mounted() {
      this.getIpPort();
      this.stopF5Refresh();
      this.stopBtnTxt = "查看报告";
      this.addRecordForm.athlete_id = window.localStorage.getItem("athlete_id");
      this.updateRecordForm.athlete_id = window.localStorage.getItem(
        "athlete_id"
      );
      this.athleteInfo.athlete_name = window.localStorage.getItem("athlete_name");
      this.athleteInfo.sex = window.localStorage.getItem("sex");
      this.record_id = window.localStorage.getItem("record_id");
    },

    created() {
      this.init(iatRecorder);
    },

    watch: {},

    methods: {
      getIpPort() {
        this.newIp = "http://" + window.location.hostname + ":9600";
        this.videoFeed = "http://" + window.location.hostname
        // this.newIp =  "http://"+'10.124.19.228:9600';
        // this.newIp = backUrl;
        // this.videoFeed = "http://" + "10.124.19.228";
      },
      ajaxAddRecord() {
        var _this = this;
        this.loadingShow = true;
        this.$axios
          .post(`${this.newIp}/record`, this.addRecordForm)
          .then((res) => {
            if (res.data) {
              _this.loadingShow = false;
              _this.stopBtnTxt = "查看报告";
              var res = res.data;
              _this.record_id = res.id;
              window.localStorage.setItem("record_id", res.id);
              _this.timer_reset = setInterval(() => {
                _this.ajaxGetPeriodicReportFront();
                _this.ajaxGetPeriodicReportBackend();
              }, 5000);
              _this.timer_resetSummy = setInterval(() => {
                _this.ajaxSummaryReport();
              }, 60000);
              _this.visible = false;
              _this.confirmLoading = false;
            } else {
            }
          })
          .catch((error) => {
            _this.errorInfo = error.message;
            _this.openNotificationWithIcon("error");
          });
      },

      ajaxUpdateRecord() {
        var _this = this;
        this.loadingShow = true;
        this.$axios
          .put(`${this.newIp}/record/${this.record_id}`, {
            id: this.record_id,
            status: "done",
          })
          .then((res) => {
            if (res.data) {
              _this.updateFlag = 1;
              _this.loadingShow = false;
              _this.stopBtnTxt = "再次训练";
              clearInterval(_this.timer_reset);
              clearInterval(_this.timer_resetSummy);
              _this.ajaxSummaryReport();
              _this.showModalReport();
              _this.visible = false;
              _this.confirmLoading = false;
            } else {
            }
          })
          .catch((error) => {
            _this.errorInfo = error.message;
            _this.openNotificationWithIcon("error");
          });
      },

      //最前端请求
      ajaxGetPeriodicReportFront() {
        var _this = this;
        this.$axios
          .get(
            `${this.newIp}/report/${this.addRecordForm.athlete_id}/${this.record_id}/periodic/front_end`
          )
          .then((res) => {
            if (res.data) {
              _this.frontPosture = res.data;
            } else {
            }
          })
          .catch((error) => {
            _this.errorInfo = error.message;
            _this.openNotificationWithIcon("error");
          });
      },

      //最远端请求
      ajaxGetPeriodicReportBackend() {
        var _this = this;
        this.$axios
          .get(
            `${this.newIp}/report/${this.addRecordForm.athlete_id}/${this.record_id}/periodic/far_end`
          )
          .then((res) => {
            if (res.data) {
              _this.backPosture = res.data;
            } else {
            }
          })
          .catch((error) => {
            _this.errorInfo = error.message;
            _this.openNotificationWithIcon("error");
          });
      },

      // 划桨动作数据请求
      ajaxSummaryReport() {
        var _this = this;
        _this.spinShow = true;
        this.$axios
          .get(
            `${this.newIp}/report/${this.addRecordForm.athlete_id}/${this.record_id}/summary`
          )
          .then((res) => {
            if (res.data) {
              _this.summaryData = res.data;
              _this.summaryData.stability = res.data.stability;
              _this.summaryData.speed = res.data.speed;
              _this.summaryData.score = res.data.score;
              _this.spinShow = false;
            } else {
            }
          })
          .catch((error) => {
            _this.errorInfo = error.message;
            _this.openNotificationWithIcon("error");
          });
      },

      startTrain() {
        this.ajaxAddRecord();
        this.iatRecorderStart();
        setInterval(this.iatRecorderStart, 10000);
      },

      stopTrain() {
        clearInterval(this.timer_reset);
        clearInterval(this.timer_resetSummy);
        this.stopBtnTxt = "再次训练";
        this.clearAll();
        // this.ajaxUpdateRecord();
      },

      showModalName() {
        this.visible = true;
      },

      showModalReport() {
        this.report = true;
        //   this.summaryData = {
        //   stability: "", 
        //   speed: "", 
        //   score: "", 
        // }
      },
      hideModalReport(event) {
        if (!this.$refs.reportContain.contains(event.target)) {
          this.report = false;
        }
      },
      getathleteid(value) {  //在list页面点击具体的运动员之后需要保存的信息
        window.localStorage.setItem("athlete_id", value.athlete_id);
        window.localStorage.setItem("athlete_name", value.athlete_name);
        window.localStorage.setItem("sex", value.sex);
        this.addRecordForm.athlete_id = window.localStorage.getItem("athlete_id");
        this.updateRecordForm.athlete_id = window.localStorage.getItem(
          "athlete_id"
        );
        this.athleteInfo.athlete_name = window.localStorage.getItem(
          "athlete_name"
        );
        this.athleteInfo.sex = window.localStorage.getItem("sex");
      },
      handleBlur() {
        console.log("blur");
      },
      handleFocus() {
        console.log("focus");
      },
      filterOption(input, option) {
        return (
          option.componentOptions.children[0].text
            .toLowerCase()
            .indexOf(input.toLowerCase()) >= 0
        );
      },

      handleCancel(e) {
        console.log("Clicked cancel button");
        this.report = false;
        if (this.report == false) {
          this.stopBtnTxt = "再次训练";
          this.clearAll();
        }
      },

      showConfirm() {
        var _this = this;
        this.$confirm({
          title: '您确定需要终止训练并且刷新页面吗？',
          content: '此时刷新页面可能会影响训练数据，建议返回继续训练或重新训练。',
          okText: '重新训练',
          cancelText: '返回',
          onOk() {
            _this.startTrain();
          },
          onCancel() { },
        });
      },

      stopF5Refresh() {
        var _this = this;
        document.onkeydown = function (e) {
          var evt = window.event || e;
          var code = evt.keyCode || evt.which;
          if (code == 116) {
            if (evt.preventDefault) {
              evt.preventDefault();
              _this.showConfirm();
            } else {
              evt.keyCode = 0;
              evt.returnValue = false;
            }
          }
        };
        //禁止鼠标右键菜单
        document.oncontextmenu = function (e) {
          return false;
        };
      },

      clearAll() {
        this.frontPosture = {
          //最前端姿势
          elbow: {
            angle: "",
            flag: 0,
            description: "",
          },
          hand: {
            angle: "",
            flag: 0,
            description: "",
          },
          arm: {
            angle: "",
            flag: 0,
            description: "",
          },
          knee: {
            angle: "",
            flag: 0,
            description: "",
          },
          torso: {
            angle: "",
            flag: 0,
            description: "",
          },
          hip: {
            angle: "",
            flag: 0,
            description: "",
          },
        }
        this.backPosture = {
          //最后端姿势
          elbow: {
            angle: "",
            flag: 0,
            description: "",
          },
          hand: {
            angle: "",
            flag: 0,
            description: "",
          },
          arm: {
            angle: "",
            flag: 0,
            description: "",
          },
          knee: {
            angle: "",
            flag: 0,
            description: "",
          },
          torso: {
            angle: "",
            flag: 0,
            description: "",
          },
          hip: {
            angle: "",
            flag: 0,
            description: "",
          },
        }

        this.summaryData = {
          stability: "",
          speed: "",
          score: "",
        }
      },
      openNotificationWithIcon(type) {
        this.$notification[type]({
          message: "错误提示",
          description: this.errorInfo,
        });
      },

      //录音 iatRecorder初始化
      init(iatRecorder) {
        // iatRecorder.onWillStatusChange = function (oldStatus, newStatus) { }
        iatRecorder.onTextChange = (text) => {
          let pattern1 = /[\|\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?|\，|\。|\？|\：|\；|\、|\‘|\’|\“|\”|\·|\！]/g;
          let pattern2 = /[\u505c][\u6b62][\u8bad][\u7ec3]/g;  //停止训练
          let pattern3 = /[\u518d][\u6b21][\u8bad][\u7ec3]/g;  //再次训练
          let pattern4 = /[\u67e5][\u770b][\u62a5][\u544a]/g;  //查看报告
          let pattern5 = /[\u5173][\u95ed][\u62a5][\u544a]/g;  //关闭报告
          if (text[text.length - 1] !== '。') {  //原始识别结束后会加上'。'，去掉最后一次的识别结果
            text = text.replace(pattern1, '');
            let isTrue2 = pattern2.test(text);
            let isTrue3 = pattern3.test(text);
            let isTrue4 = pattern4.test(text);
            let isTrue5 = pattern5.test(text);
            if (isTrue2) { //停止训练
              this.stopTrain();
              return
            }
            if (isTrue3) { //再次训练
              this.startTrain();
              return
            }
            if (isTrue4) { //查看报告
              this.ajaxUpdateRecord();
              return
            }
            if (isTrue5) { //关闭报告
              this.report = false;
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
    },
  };
</script>

<style>
  .spin-content {
    border: 1px solid #91d5ff;
    background-color: #e6f7ff;
    padding: 30px;
  }

  /* report mask --- start*/
  .reportModal {
    height: 100vh;
    width: 100%;
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 0;
    left: 0;
    z-index: 9999;
    background: rgba(155, 155, 155, 0.1);
  }

  .reportModal .reportContain {
    width: 500px;
    height: 750px;
  }

  .reportModal .reportContain .ant-spin-nested-loading {
    margin-top: 50%;
    background-color: rgba(255, 255, 255, 0.8);
  }

  .reportModal .reportContain .reportBg {
    width: 100%;
    height: 100%;
    position: relative;
    background: url('../static/img/images/reportBg.png') no-repeat center;
    background-size: 100%;
  }

  .reportModal .reportContain .reportBg .list-head {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -250px);
    text-align: center;
  }

  .reportModal .reportContain .reportBg .list-head .score {
    color: #ff0030;
    font-weight: bold;
    font-size: 66px;
  }

  .list {
    position: absolute;
    left: 25%;
    top: 230px;
  }

  .list li {
    list-style-type: none;
    width: 90%;
    height: 60px;
    padding: 6.5px 0 6.5px 0;
    margin: 3px 0;
    font-size: 12px;
  }

  .list li p {
    width: 100%;
    margin: 0;
    position: relative;
    top: 50%;
    transform: translateY(-50%);
  }

  /* report mask --- end */
</style>