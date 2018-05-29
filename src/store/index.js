import Vuex from 'vuex';
import Vue from 'vue';
import shop from '../api/shop'


Vue.use(Vuex);

export default new Vuex.Store({
    state: { // = data
        products: [],
        // {id, quantity}
        cart: [],
        checkoutStatus: null
    },

    getters: { // = computed properties
        availableProducts (state, getters) {
            return state.products.filter(product => product.inventory > 0);
        },

        cartProducts (state) {
            return state.cart.map(cartItem => {
                const product = state.products.find(product => product.id === cartItem.id);

                return {
                    title: product.title,
                    price: product.price,
                    quantity: cartItem.quantity
                }
            })
        },

        cartTotal (state, getters) {
            let total = 0;

            getters.cartProducts.forEach(product => {
                total += product.price * product.quantity;
            })

            return total;
        },

        productIsInStock () {
            return product => {
                return product.inventory > 0;
            }
        }
    },

    actions: { // = methods
        fetchProducts (context) {
            return new Promise((resolve, reject) => {
                // make api call

                // run set products mutation
                shop.getProducts(products => {
                    context.commit('setProducts', products);
                });
                resolve();
            })
        },

        addProductToCart(context, product) {
            if (context.getters.productIsInStock(product)) {
                const cartItem = context.state.cart.find(item => item.id === product.id);
                // find cart item
                if(!cartItem) {
                    // push product to cart
                    context.commit('pushProductToCart', product.id)
                } else {
                    // incremnet quantity
                    context.commit('incrementItemQuantity', cartItem)

                }
                context.commit('decremenetProductInventory', product)
            }
        },

        checkout(context) {
            shop.buyProducts(
                context.state.cart,
                () => {
                    context.commit('emptyCart');
                    context.commit('setCheckoutStatus', 'success')
                },
                () => {
                    context.commit('setCheckoutStatus', 'fail')

                }
            )
        }
    },

    mutations: { // setting and updateing state
        setProducts (state, products) {
            // update products
            state.products = products;
        },

        pushProductToCart(state, productId) {
            state.cart.push({
                id: productId,
                quantity: 1
            })
        },

        incrementItemQuantity(state, cartItem) {
            cartItem.quantity++;
        },

        decremenetProductInventory(state, product) {
            product.inventory--;
        },

        setCheckoutStatus(state, status) {
            state.checkoutStatus = status;
        },

        emptyCart(state) {
            state.cart = [];
        }
    }
})
