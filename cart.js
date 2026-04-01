const Cart = {
    // 取得購物車資料（加入防護）
    getItems: () => {
        try {
            const stored = localStorage.getItem('myCart');
            if (!stored) return [];
            const parsed = JSON.parse(stored);
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            console.error('讀取購物車失敗:', e);
            return [];
        }
    },
    
    // 儲存購物車資料（加入防護）
    saveItems: (items) => {
        try {
            localStorage.setItem('myCart', JSON.stringify(items));
            return true;
        } catch (e) {
            console.error('儲存購物車失敗:', e);
            return false;
        }
    },
    
    // 加入商品
    addItem: (id, name, price, maxQuantity) => {
        let items = Cart.getItems();
        const existingItem = items.find(item => item.id == id);
        const currentQtyInCart = existingItem ? existingItem.quantity : 0;
        
        if (currentQtyInCart >= maxQuantity) {
            alert('❌ 此商品庫存不足，無法再新增！');
            return false;
        }

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            items.push({ id: id.toString(), name, price, quantity: 1 });
        }

        if (!Cart.saveItems(items)) {
            alert('❌ 儲存失敗，請稍後再試');
            return false;
        }
        
        alert('✅ 成功加入購物車！');
        
        // 更新所有 UI
        Cart.updateAllUI();
        return true;
    },

    // 移除商品
    removeItem: (index) => {
        let items = Cart.getItems();
        if (index >= 0 && index < items.length) {
            items.splice(index, 1);
            Cart.saveItems(items);
            Cart.updateAllUI();
        }
    },
    
    // 更新數量
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
        Cart.saveItems(items);
        Cart.updateAllUI();
    },
    
    // 清空購物車
    clearCart: () => {
        if (confirm('確定要清空購物車嗎？')) {
            Cart.saveItems([]);
            Cart.updateAllUI();
        }
    },

    // 計算總金額
    getTotal: () => {
        const items = Cart.getItems();
        return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },
    
    // 獲取商品總數量
    getTotalCount: () => {
        const items = Cart.getItems();
        return items.reduce((sum, item) => sum + (item.quantity || 1), 0);
    },
    
    // 更新所有 UI（導覽列 + 頁面購物車列表）
    updateAllUI: () => {
        // 更新導覽列數字
        Cart.updateNavCount();
        
        // 如果頁面有購物車列表 UI，更新它
        if (typeof updateCartUI === 'function') {
            updateCartUI();
        }
        
        // 如果頁面有商品列表，重新渲染（更新按鈕狀態）
        if (typeof window.renderProducts === 'function' && window.allProducts) {
            window.renderProducts(window.allProducts);
        }
        
        // 觸發自定義事件，讓其他監聽器可以回應
        try {
            window.dispatchEvent(new CustomEvent('cartUpdated', { 
                detail: { items: Cart.getItems(), totalCount: Cart.getTotalCount() }
            }));
        } catch(e) {}
    },
    
    // 更新導覽列購物車數量
    updateNavCount: () => {
        const totalCount = Cart.getTotalCount();
        
        // 直接更新 DOM 元素
        const cartCountSpan = document.getElementById('cartCount');
        const mobileCartCountSpan = document.getElementById('mobileCartCount');
        
        if (cartCountSpan) cartCountSpan.textContent = totalCount;
        if (mobileCartCountSpan) mobileCartCountSpan.textContent = totalCount;
        
        // 呼叫全域函數（如果存在）
        if (typeof window.updateNavCart === 'function') {
            window.updateNavCart();
        }
        
        // 觸發 storage 事件（讓其他頁面同步）
        try {
            window.dispatchEvent(new Event('storage'));
        } catch(e) {}
    }
};

// ========= 頁面載入時初始化 =========
(function initCart() {
    // 確保購物車資料存在且格式正確
    const existing = localStorage.getItem('myCart');
    if (!existing) {
        // 首次使用，建立空購物車
        localStorage.setItem('myCart', '[]');
    } else {
        try {
            const parsed = JSON.parse(existing);
            if (!Array.isArray(parsed)) {
                localStorage.setItem('myCart', '[]');
            }
        } catch(e) {
            localStorage.setItem('myCart', '[]');
        }
    }
    
    // 更新導覽列數量
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => Cart.updateNavCount());
    } else {
        Cart.updateNavCount();
    }
    
    // 監聽 storage 事件（跨頁面同步）
    window.addEventListener('storage', function(e) {
        if (e.key === 'myCart') {
            Cart.updateNavCount();
            // 如果有頁面購物車 UI，也更新
            if (typeof updateCartUI === 'function') updateCartUI();
            if (typeof window.renderProducts === 'function' && window.allProducts) {
                window.renderProducts(window.allProducts);
            }
        }
    });
})();

// 將 Cart 掛載到全域，方便其他腳本呼叫
window.Cart = Cart;
