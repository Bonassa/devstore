import { ImageResponse } from 'next/og'
import colors from 'tailwindcss/colors'

import { env } from '@/env'
import { api } from '@/infra/api'
import { ProductType } from '@/dtos/products'

interface ProductProps {
  params: {
    slug: string
  }
}

export const runtime = 'edge'

export const alt = 'About Acme'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

async function getProduct(slug: string): Promise<ProductType> {
  const response = await api(`/products/${slug}`, {
    next: {
      revalidate: 60 * 60, // 1 hour
    },
  })

  const products = await response.json()
  return products
}

export default async function OgImage({ params }: ProductProps) {
  const product = await getProduct(params.slug)

  const productImageUrl = new URL(product.image, env.APP_URL).toString()

  return new ImageResponse(
    (
      <div
        style={{
          background: colors.zinc[950],
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <img src={productImageUrl} alt="" style={{ width: '100%' }} />
      </div>
    ),
    {
      ...size,
    },
  )
}
