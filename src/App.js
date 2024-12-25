import React, { useState, useEffect } from 'react';
import { Table, Spin, Typography, Layout } from 'antd';
import supabase from './supabaseClient';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

function App() {
  const [userWorkspaces, setUserWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);

  // Função para buscar dados do Supabase
  const fetchUserWorkspaces = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('user_workspaces_view').select('*');

    if (error) {
      console.error('Erro ao buscar dados:', error);
    } else {
      setUserWorkspaces(data);
    }

    setLoading(false);
  };

  // Faz a chamada ao Supabase na montagem do componente
  useEffect(() => {
    fetchUserWorkspaces();
  }, []);

  // Definição das colunas da tabela
  const columns = [
    {
      title: 'User ID',
      dataIndex: 'user_id',
      key: 'user_id',
    },
    {
      title: 'User Name',
      dataIndex: 'user_name',
      key: 'user_name',
    },
    {
      title: 'Workspace ID',
      dataIndex: 'workspace_id',
      key: 'workspace_id',
    },
    {
      title: 'Workspace Name',
      dataIndex: 'workspace_name',
      key: 'workspace_name',
    },
    {
      title: 'User Role',
      dataIndex: 'user_role',
      key: 'user_role',
    },
    {
      title: 'Workspace Created At',
      dataIndex: 'workspace_created_at',
      key: 'workspace_created_at',
    },
    {
      title: 'User Joined At',
      dataIndex: 'user_joined_at',
      key: 'user_joined_at',
    },
    {
      title: 'Workspace Initials',
      dataIndex: 'workspace_initials',
      key: 'workspace_initials',
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ backgroundColor: '#001529', padding: '10px' }}>
        <Title level={3} style={{ color: '#fff', textAlign: 'center' }}>
          Lista de Workspaces de Usuáriosssss
        </Title>
      </Header>
      <Content style={{ padding: '20px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Spin size="large" />
          </div>
        ) : (
          <Table
            dataSource={userWorkspaces}
            columns={columns}
            rowKey={(record) => record.workspace_id}
            bordered
            pagination={{ pageSize: 10 }}
          />
        )}
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        © {new Date().getFullYear()} Sua Empresa - Todos os direitos reservados.
      </Footer>
    </Layout>
  );
}

export default App;