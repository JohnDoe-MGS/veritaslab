/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuração para exportação estática, necessária para o Firebase Hosting
  output: 'export',

  // Desativa a otimização de imagens do Next.js, 
  // que não é compatível com a exportação estática.
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
