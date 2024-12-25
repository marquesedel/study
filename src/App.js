import React, { useState, useEffect } from 'react';
import { message, Button, Upload, Row, Col, Modal, Spin, Typography, Image } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import supabase from './supabaseClient';

const { Title } = Typography;

function App() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Função para buscar imagens do Supabase
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
  }, []);

  const handleUpload = async ({ file, onSuccess, onError }) => {
    setUploading(true);

    try {
      // Usar apenas o nome original do arquivo
      const fileName = file.name;

      // Fazer upload para o Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('images') // Substitua pelo nome do seu bucket
        .upload(`public/${fileName}`, file);

      if (uploadError) {
        message.error(`Erro ao fazer upload da imagem: ${fileName}`);
        console.error(uploadError);
        onError(uploadError);
        setUploading(false);
        return;
      }

      // Gerar a URL pública da imagem
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
    console.log('URL pública gerada:', publicUrl);

      // Criar uma linha na tabela photos
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
      fetchPhotos(); // Atualizar a lista de imagens
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

  return (
    <div style={{ padding: '20px' }}>
      <Title level={3}>Galeria de Imagens</Title>
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
}

export default App;