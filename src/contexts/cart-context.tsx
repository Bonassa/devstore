'use client'

import { CartItem } from '@/dtos/cart-item'
import { createContext, useContext, useState } from 'react'

interface CartContextProps {
  items: CartItem[]
  addToCart: (productId: number) => void
}

interface CartProviderProps {
  children: React.ReactNode
}

export const CartContext = createContext({} as CartContextProps)

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  function addToCart(productId: number) {
    setCartItems((prev) => {
      const productInCart = prev.some((item) => item.productId === productId)

      if (productInCart) {
        return prev.map((item) => {
          if (item.productId === productId) {
            return { ...item, quantity: item.quantity + 1 }
          }

          return item
        })
      } else {
        return [...prev, { productId, quantity: 1 }]
      }
    })
  }

  return (
    <CartContext.Provider
      value={{
        items: cartItems,
        addToCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
