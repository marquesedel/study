import React, { useState, useEffect } from 'react';
import { message, Button, Upload, Row, Col, Modal, Typography, Image } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Routes, Route, Navigate } from 'react-router-dom';
import supabase from './supabaseClient';
import Login from './pages/Login';

const { Title } = Typography;

function App() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [session, setSession] = useState(null);

  const fetchPhotos = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('photos').select('*');
    if (error) {
      console.error('Erro ao buscar fotos:', error);
    } else {
      setPhotos(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPhotos();

    // Obter a sessão inicial do Supabase
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listener para mudanças na autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Cancelar a inscrição ao desmontar o componente
    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  const handleUpload = async ({ file, onSuccess, onError }) => {
    setUploading(true);
    try {
      const fileName = file.name;
      const { data, error: uploadError } = await supabase.storage
        .from('images')
        .upload(`public/${fileName}`, file);

      if (uploadError) {
        message.error(`Erro ao fazer upload da imagem: ${fileName}`);
        console.error(uploadError);
        onError(uploadError);
        setUploading(false);
        return;
      }

      const { data: publicUrlData, error: publicUrlError } = supabase.storage
        .from('images')
        .getPublicUrl(`public/${fileName}`);

      if (publicUrlError || !publicUrlData) {
        console.error('Erro ao gerar URL pública:', publicUrlError);
        message.error(`Erro ao obter URL pública da imagem: ${fileName}`);
        onError(publicUrlError || 'URL pública ausente');
        setUploading(false);
        return;
      }

      const publicUrl = publicUrlData.publicUrl;

      const { error: insertError } = await supabase.from('photos').insert([
        {
          url: publicUrl,
          status: 'active',
          uploaded_at: new Date(),
          project_id: '91cd57f4-8216-4b3a-83fd-b9efd5ad79bd',
          photo_order: '1',
        },
      ]);

      if (insertError) {
        message.error(`Erro ao salvar dados no banco de dados: ${fileName}`);
        console.error(insertError);
        onError(insertError);
        setUploading(false);
        return;
      }

      message.success(`Imagem ${fileName} enviada com sucesso!`);
      onSuccess(null, file);
    } catch (error) {
      console.error('Erro inesperado no upload:', error);
      onError(error);
    } finally {
      fetchPhotos();
      setUploading(false);
    }
  };

  const openModal = (index) => {
    setCurrentIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  const AppContent = () => (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={3}>Galeria de Imagens</Title>
        <Button type="primary" danger onClick={handleLogout}>
          Logout
        </Button>
      </div>
      <Upload
        customRequest={handleUpload}
        showUploadList={false}
        accept="image/*"
        multiple
      >
        <Button type="primary" icon={<PlusOutlined />} loading={uploading}>
          Upload de Imagens
        </Button>
      </Upload>
      <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
        {photos.map((photo, index) => (
          <Col key={index} xs={24} sm={12} md={8} lg={6} xl={4}>
            <Image
              src={photo.url}
              alt={`Photo ${index}`}
              style={{ width: '100%', height: '150px', objectFit: 'cover' }}
              onClick={() => openModal(index)}
            />
          </Col>
        ))}
      </Row>
      <Modal
        visible={isModalOpen}
        footer={null}
        onCancel={closeModal}
        centered
        width="80%"
      >
        <Image
          src={photos[currentIndex]?.url}
          style={{ maxWidth: '100%', maxHeight: '80vh' }}
        />
      </Modal>
    </div>
  );

  return (
    <Routes>
      {session ? (
        <>
          <Route path="/" element={<AppContent />} />
          <Route path="/login" element={<Navigate to="/" />} />
        </>
      ) : (
        <Route path="*" element={<Login />} />
      )}
    </Routes>
  );
}

export default App;