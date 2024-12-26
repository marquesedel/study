import React, { useState } from 'react';
import supabase from '../supabaseClient';// Certifique-se de que o caminho está correto
import { Button, Input, Form, Typography, message } from 'antd';

const { Title } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values) => {
    const { email, password } = values;
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      message.error('Erro ao fazer login: ' + error.message);
    } else {
      message.success('Login bem-sucedido!');
      // Redirecionar ou atualizar estado
      window.location.reload(); // Exemplo básico para recarregar e verificar a sessão
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', textAlign: 'center' }}>
      <Title level={3}>Login</Title>
      <Form
        onFinish={handleLogin}
        layout="vertical"
        style={{ textAlign: 'left' }}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Por favor, insira seu email!' }]}
        >
          <Input type="email" placeholder="Digite seu email" />
        </Form.Item>
        <Form.Item
          label="Senha"
          name="password"
          rules={[{ required: true, message: 'Por favor, insira sua senha!' }]}
        >
          <Input.Password placeholder="Digite sua senha" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;