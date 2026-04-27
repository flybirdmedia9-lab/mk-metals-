import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getCartItems, saveCartItems } from '../data/storage.js'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(getCartItems)

  useEffect(() => {
    saveCartItems(cartItems)
  }, [cartItems])

  const addToCart = (product, quantity = 1) => {
    setCartItems((current) => {
      const existing = current.find((item) => item.id === product.id)
      if (existing) {
        return current.map((item) =>
          item.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, 99) }
            : item,
        )
      }
      return [...current, { id: product.id, slug: product.slug, name: product.name, image: product.image, price: product.price, contactForPrice: product.contactForPrice, quantity }]
    })
  }

  const updateQuantity = (productId, quantity) => {
    setCartItems((current) =>
      current
        .map((item) => (item.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item))
        .filter((item) => item.quantity > 0),
    )
  }

  const removeFromCart = (productId) => {
    setCartItems((current) => current.filter((item) => item.id !== productId))
  }

  const clearCart = () => {
    setCartItems([])
  }

  const cartTotal = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems],
  )

  const cartAmount = useMemo(
    () =>
      cartItems.reduce((total, item) => {
        if (!item.contactForPrice && item.price) {
          return total + Number(item.price.replace(/[^0-9.]/g, '')) * item.quantity
        }
        return total
      }, 0),
    [cartItems],
  )

  const value = {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartTotal,
    cartAmount,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
