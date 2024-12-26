import React, { useState } from 'react';
import supabase from '../supabaseClient'; // Certifique-se de que o caminho está correto
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

    setLoading(true);
  };

  return (
    <div style={styles.container}>
      {/* Área do formulário de login */}
      <div style={styles.loginForm}>
        <Title level={2} style={styles.title}>
          Welcome back!
        </Title>
        <p style={styles.subtitle}>
          Enter to get unlimited access to data & information.
        </p>
        <Form
          onFinish={handleLogin}
          layout="vertical"
          style={{ textAlign: 'left' }}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Por favor, insira seu email!' }]}
            style={{ marginBottom: '16px' }}
          >
            <Input type="email" size="large" placeholder="Digite seu email" />
          </Form.Item>
          <Form.Item
            label="Senha"
            name="password"
            rules={[{ required: true, message: 'Por favor, insira sua senha!' }]}
          >
            <Input.Password size="large" placeholder="Digite sua senha" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" shape='round' size="large" htmlType="submit" loading={loading} block>
              Login
            </Button>
          </Form.Item>
        </Form>
        <div style={styles.links}>
          <a href="#" style={styles.link}>
            Forgot your password?
          </a>
        </div>
        <div style={styles.register}>
          Don't have an account? <a href="#" style={styles.registerLink}>Register here</a>
        </div>
      </div>

      {/* Área de fundo à direita */}
      <div style={styles.background}>
        {/* Aqui você pode adicionar outros elementos ou texto */}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    width: '100%',
  },
  loginForm: {
    flex: 1,
    maxWidth: '500px',
    padding: '200px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  title: {
    marginBottom: '10px',
    textAlign: 'left',
  },
  subtitle: {
    color: '#888',
    marginBottom: '30px',
    textAlign: 'left',
  },
  links: {
    marginTop: '10px',
    textAlign: 'left',
  },
  link: {
    color: '#1890ff',
    textDecoration: 'none',
  },
  register: {
    marginTop: '20px',
    textAlign: 'left',
  },
  registerLink: {
    color: '#1890ff',
    textDecoration: 'none',
  },
  background: {
    flex: 2,
    backgroundColor: '#1890ff', // Cor azul do botão
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
};

export default Login;