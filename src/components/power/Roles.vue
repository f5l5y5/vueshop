<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRole">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表区 -->
      <el-table :data="rolelist" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag
                  closable
                  @close="removeRightById(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <!-- 通过嵌套渲染二级权限 -->
                <el-row
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      type="warning"
                      @close="removeRightById(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- <pre>{{ scope.row }}</pre> -->
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="editRole(scope.row)"
              >编辑</el-button
            >
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteRole(scope.row.id)"
              >删除</el-button
            >
            <el-button
              type="warning"
              size="mini"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色的对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRoleDialogVisible"
      width="50%"
      @close="addRoleDialogClosed"
    >
      <!-- 角色用户信息表单 -->
      <el-form
        :model="addRoleForm"
        :rules="addRoleRules"
        ref="addRoleRef"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 按钮保存取消区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addEditRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户的对话框 -->
    <!-- 分配权限的对话框 -->
    <el-dialog
      title="提示"
      @close="setRightDialogClosed"
      :visible.sync="setRightDialogVisible"
      width="50%"
    >
      <!-- 树形结构展示区 -->
      <el-tree
        :data="rightList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        ref="treeRef"
        :default-checked-keys="defKeys"
        default-expand-all
      ></el-tree>
      <!-- 按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 角色列表数据
      rolelist: [],
      //   分配权限的对话框
      setRightDialogVisible: false,
      //   所有权限的数据
      rightList: [],
      //   树形控件的属性绑定对象
      treeProps: {
        label: 'authName',
        // 通过什么嵌套
        children: 'children'
      },
      //   默认选中节点的id值数组 点击分配权限的按钮，获取当前角色的三级权限，放入这个数组中
      defKeys: [],
      //   当前选中的角色id
      roleId: '',
      //   添加角色的对话框
      addRoleDialogVisible: false,
      //   添加角色表单
      addRoleForm: {
        roleName: '',
        roleDesc: ''
      },
      //   表单验证规则
      addRoleRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          {
            min: 1,
            max: 15,
            message: '长度在 1 到 15 个字符',
            trigger: 'blur'
          }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      },
      //   判断是什么操作
      op: '',
      //   保存当前行的信息
      roleInfo: {}
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    //  角色列表
    async getRolesList () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.rolelist = res.data
    },
    // 根据id删除对应权限
    async removeRightById (role, rightId) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch((err) => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消了删除')
      }
      //   this.$message.success('确认了删除')
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('删除权限失败')
      }
      //   this.getRolesList()
      // 如果在直接获取会关闭，重新赋值role就可以 防止整个列表刷新
      role.children = res.data
    },
    // 展示分配权限的对话框
    async showSetRightDialog (role) {
      this.roleId = role.id
      //   获取所有权限的数据
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限列表失败')
      }
      //   权限列表的数据
      this.rightList = res.data
      //   递归获取三级节点的Id
      this.getLeafKeys(role, this.defKeys)
      this.setRightDialogVisible = true
    },
    // 通过递归的形式 获取角色下所有三级权限的id 保存到defKeys数组中
    getLeafKeys (node, arr) {
      // 如果当前节点不包含children属性 则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach((item) => {
        this.getLeafKeys(item, arr)
      })
    },
    // 监听权限对话框关闭事件
    setRightDialogClosed () {
      this.defKeys = []
    },
    // 角色分配权限
    async allotRights () {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: idStr }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败')
      }
      this.$message.success('分配权限成功')
      //   获取用户列表
      this.getRolesList()
      //   关闭对话框
      this.setRightDialogVisible = false
    },
    //
    addRole () {
      this.addRoleDialogVisible = true
      this.op = 'add'
    },
    // 对话框中点击确认添加角色
    addEditRole () {
      this.$refs.addRoleRef.validate(async (valid) => {
        if (!valid) return false
        if (this.op === 'add') {
          const { data: res } = await this.$http.post('roles', this.addRoleForm)
          console.log(res)
          if (res.meta.status !== 201) {
            return this.$message.error('添加角色失败')
          }
        } else if (this.op === 'edit') {
          const { data: res } = await this.$http.put(`roles/${this.roleInfo.id}`, this.addRoleForm)
          console.log(res)
          if (res.meta.status !== 200) {
            return this.$message.error('修改角色失败')
          }
        }
        this.getRolesList()
        this.addRoleDialogVisible = false
      })
    },
    // 添加角色的对话框关闭
    addRoleDialogClosed () {
      this.$refs.addRoleRef.resetFields()
    },
    // 编辑角色的对话框
    editRole (roleInfo) {
      this.op = 'edit'
      this.addRoleDialogVisible = true
      this.addRoleForm = roleInfo
      this.roleInfo = roleInfo
    },
    // 删除角色
    async deleteRole (roleId) {
      const confirmResult = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      console.log(confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消删除')
      }
      const { data: res } = await this.$http.delete('roles/' + roleId)
      if (res.meta.status !== 200) {
        return this.$message.error('删除角色失败')
      }
      this.getRolesList()
    }
  }
}
</script>

<style lang="scss" scoped>
.el-tag {
  margin: 7px;
}

.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
