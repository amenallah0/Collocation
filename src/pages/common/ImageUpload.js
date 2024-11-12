import { useCallback } from 'react';
import { Box, Input, Text, VStack, Image } from '@chakra-ui/react';
import { useDropzone } from 'react-dropzone';

const ImageUpload = ({ onImagesSelected, maxFiles = 5 }) => {
  const onDrop = useCallback((acceptedFiles) => {
    const images = acceptedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    onImagesSelected(images);
  }, [onImagesSelected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxFiles,
  });

  return (
    <Box
      {...getRootProps()}
      p={6}
      border="2px dashed"
      borderColor={isDragActive ? "blue.400" : "gray.200"}
      borderRadius="lg"
      cursor="pointer"
      transition="all 0.2s"
      _hover={{ borderColor: "blue.400" }}
    >
      <Input {...getInputProps()} />
      <VStack spacing={2}>
        <Text color="gray.500" textAlign="center">
          {isDragActive
            ? "Déposez les images ici..."
            : "Glissez-déposez vos images ici, ou cliquez pour sélectionner"}
        </Text>
        <Text fontSize="sm" color="gray.400">
          Maximum {maxFiles} images - JPG, PNG
        </Text>
      </VStack>
    </Box>
  );
};

export default ImageUpload;