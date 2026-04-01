const Cart = {
    // 取得購物車資料
    getItems: () => JSON.parse(localStorage.getItem('myCart') || '[]'),
    
    // 加入商品
    addItem: (id, name, price, maxQuantity) => {
        let items = Cart.getItems();
        const existingItem = items.find(item => item.id === id);
        const currentQtyInCart = existingItem ? existingItem.quantity : 0;
        
        if (currentQtyInCart >= maxQuantity) {
            alert('❌ 此商品庫存不足，無法再新增！');
            return;
        }

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            items.push({ id, name, price, quantity: 1 });
        }

        localStorage.setItem('myCart', JSON.stringify(items));
        alert('✅ 成功加入購物車！');
        
        // 更新購物車 UI (如果頁面有這個函數)
        if (typeof updateCartUI === 'function') updateCartUI();
        
        // 重新渲染產品列表，更新按鈕狀態
        if (typeof window.renderProducts === 'function' && window.allProducts) {
            window.renderProducts(window.allProducts);
        }
        
        // ========= 新增：更新導覽列購物車數量 =========
        Cart.updateNavCount();
    },

    // 移除商品
    removeItem: (index) => {
        let items = Cart.getItems();
        items.splice(index, 1);
        localStorage.setItem('myCart', JSON.stringify(items));
        
        if (typeof updateCartUI === 'function') updateCartUI();
        if (typeof window.renderProducts === 'function' && window.allProducts) {
            window.renderProducts(window.allProducts);
        }
        
        // ========= 新增：更新導覽列購物車數量 =========
        Cart.updateNavCount();
    },
    
    // 更新數量（可選，如果您有這個功能）
    updateQuantity: (index, delta, maxStock) => {
        let items = Cart.getItems();
        if (!items[index]) return;
        
        const newQty = items[index].quantity + delta;
        if (newQty < 1) {
            Cart.removeItem(index);
            return;
        }
        
        if (maxStock !== undefined && newQty > maxStock) {
            alert(`庫存僅剩 ${maxStock} 件，無法增加`);
            return;
        }
        
        items[index].quantity = newQty;
        localStorage.setItem('myCart', JSON.stringify(items));
        
        if (typeof updateCartUI === 'function') updateCartUI();
        if (typeof window.renderProducts === 'function' && window.allProducts) {
            window.renderProducts(window.allProducts);
        }
        
        // ========= 新增：更新導覽列購物車數量 =========
        Cart.updateNavCount();
    },
    
    // 清空購物車
    clearCart: () => {
        if (confirm('確定要清空購物車嗎？')) {
            localStorage.setItem('myCart', '[]');
            
            if (typeof updateCartUI === 'function') updateCartUI();
            if (typeof window.renderProducts === 'function' && window.allProducts) {
                window.renderProducts(window.allProducts);
            }
            
            // ========= 新增：更新導覽列購物車數量 =========
            Cart.updateNavCount();
        }
    },

    // 計算總金額
    getTotal: () => Cart.getItems().reduce((sum, item) => sum + (item.price * item.quantity), 0),
    
    // ========= 新增：更新導覽列購物車數量的方法 =========
    updateNavCount: () => {
        // 嘗試呼叫全域函數（如果 nav.html 已經載入）
        if (typeof window.updateNavCart === 'function') {
            window.updateNavCart();
        }
        
        // 手動觸發 storage 事件（讓 nav.html 的監聽器也能更新）
        try {
            window.dispatchEvent(new Event('storage'));
        } catch(e) {
            // 忽略錯誤
        }
        
        // 直接更新 DOM 元素（如果存在且尚未透過事件更新）
        setTimeout(() => {
            const cartCountSpan = document.getElementById('cartCount');
            const mobileCartCountSpan = document.getElementById('mobileCartCount');
            if (cartCountSpan || mobileCartCountSpan) {
                try {
                    const cart = JSON.parse(localStorage.getItem('myCart') || '[]');
                    const totalCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
                    if (cartCountSpan) cartCountSpan.textContent = totalCount;
                    if (mobileCartCountSpan) mobileCartCountSpan.textContent = totalCount;
                } catch(e) {}
            }
        }, 10);
    }
};

// ========= 新增：當頁面載入時，也執行一次更新 =========
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Cart.updateNavCount());
} else {
    Cart.updateNavCount();
}
