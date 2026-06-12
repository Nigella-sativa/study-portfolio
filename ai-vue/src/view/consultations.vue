<template>
    <div>
        <PageHead title="咨询记录" />
        <el-table :data="tableData" style="width: 100%">
            <el-table-column label="会话ID" width="100">
                <template #default="scope">
                    <el-avatar>{{ scope.row.userNickname }}</el-avatar>
                    <!-- 使用头像组件el-avatar显示用户头像 -->
                </template>
            </el-table-column>
            <el-table-column label="情绪日志">
                <template #default="scope">
                    <div class="session-title">{{ scope.row.sessionTitle }}</div>
                    <div class="session-preview">{{ scope.row.lastMessageContent }}</div>
                </template>              
            </el-table-column>
            <el-table-column prop="messageCount" label="消息数" width="100"></el-table-column>
            <el-table-column prop="lastMessageTime" label="时间" width="100"></el-table-column>
            <el-table-column label="操作" width="100">
                <template #default="scope">
                    <el-button type="primary" text @click="viewSessionDetail(scope.row)">详情</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            style="margin-top: 25px"
            :page-size="pagination.size"
            layout="prev, pager, next"
            :total="pagination.total"
            @change="handleChange"
        />
        <el-dialog
            v-model="showDetailDialog"
            title="咨询会话详情"
            width="70%"
            :close-on-click-modal="false"
        >
        <!-- close-on-click-modal="false"：点击弹窗外部不关闭弹窗 -->
            <div class="session-detail">
                <div class="detail-header">
                    <div class="detail-row">
                        <div class="detail-label">用户：</div>
                        <div class="detail-value">{{ sessionDetail.userNickname }}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">开始时间：</div>
                        <div class="detail-value">{{ sessionDetail.startedAt }}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">消息数：</div>
                        <div class="detail-value">{{ sessionDetail.messageCount }}</div>
                    </div>
                </div>
                <div class="messages-container">
                    <div class="message-header">
                        <h4>对话记录</h4>
                    </div>
                    <div class="messages-list" v-loading="loadingMessages">
                        <!-- 第一次点击详情的时候，由于需要调接口，获取对话信息需要一定的时间：遍历会话消息列表，渲染每个消息 因此添加loading效果 -->
                        <div v-for="message in sessionMessages" :key="message.id" class="message-item"  :class="message.senderType === 1 ? 'user-message' : 'ai-message'">
                            <!-- 通过senderType字段判断是用户消息还是助手消息 -->
                            <div class="message-header">
                                <span class="sender">{{ message.senderType === 1 ? '用户' : 'AI助手' }}</span>
                                <span class="time">{{ message.createdAt }}</span>
                            </div>
                            <div class="message-content">{{ message.content }}</div>
                        </div>
                    </div>
                </div>
            </div>
            <template #footer>
                <el-button @click="showDetailDialog = false">关闭</el-button>
                <!-- 通过一个具名槽位footer，来定义弹窗的底部按钮 -->
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import PageHead from '@/components/PageHead.vue'
import { onMounted, ref, reactive } from 'vue';
import { getConsultationPage, getSessionDetail } from '@/api/admin'

const tableData = ref([])

const pagination = reactive({
    currentPage: 1,
    size: 10,
    total: 0
})

//会话详情
const sessionDetail = ref({})
const sessionMessages = ref([])
const showDetailDialog = ref(false)
const loadingMessages = ref(false)

const viewSessionDetail =(row) =>{
    loadingMessages.value = true
        showDetailDialog.value = true
    // 用户点击详情之后，在调用接口之前,先展示弹窗 并且loadingMessages为true，也就是显示loading效果
    getSessionDetail(row.id).then(res =>{
        loadingMessages.value = false
        //接口调用完成，会话信息加载出来以后，loading效果关闭
        sessionMessages.value = res
        sessionDetail.value = row
        // 弹窗控制条件：showDetailDialog属性进行控制
    })
}

const handleChange = (page) =>{
    pagination.currentPage = page
    handleSearch()
}

const handleSearch = () =>{
    getConsultationPage(pagination).then(res =>{
        const {records, total } = res
        tableData.value = records
        pagination.total = total
    })
}



onMounted(() =>{
    handleSearch()
})
</script>

<style lang="scss" scoped>
.session-title {
    font-weight: 500;
    color: #333;
    margin-bottom: 4px;
  }
  .session-preview {
    font-size: 13px;
    color: #666;
    margin-bottom: 4px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .session-detail {
    max-height: 70vh;
    overflow-y: auto;
    .detail-header {
      margin-bottom: 20px;
      padding: 16px;
      background: #f8f9fa;
      border-radius: 8px;
      border: 1px solid #e9ecef;
    }

    .detail-row {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      :last-child {
        margin-bottom: 0;
      }
      .detail-label {
        font-weight: 500;
        color: #495057;
        min-width: 80px;
        margin-right: 8px;
      }

      .detail-value {
        color: #333;
      }
    }
  }
  .messages-container {
    margin-top: 20px;
    .messages-header {
      margin-bottom: 16px;
      h4 {
        margin: 0;
        color: #333;
        font-size: 16px;
        font-weight: 500;
      }
    }
    .messages-list {
      max-height: 400px;
      overflow-y: auto;
      border: 1px solid #e9ecef;
      border-radius: 8px;
      padding: 16px;
      background: #fff;
      .message-item {
        margin-bottom: 12px;
        padding: 12px;
        border-radius: 8px;
        background: #f8f9fa;
        border: 1px solid #e9ecef;
        :last-child {
          margin-bottom: 0;
        }
        &.user-message {
          background: #e8f4fd;
        }

        &.ai-message {
          background: #f0f9f0;
        }
      }
      .message-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        .sender {
          font-weight: 500;
          color: #333;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .time {
          font-size: 12px;
          color: #999;
        }

        .message-content {
          color: #333;
          line-height: 1.6;
          white-space: pre-wrap;
          margin-top: 8px;
          font-size: 14px;
        }
      }
    }
  }
</style>