<template>

    <div>

        <h1>Product List</h1>

        <img v-if="loading" src="http://img.vast.com/128x96/-3089682187326368659" alt="">

        <ul v-else>

            <li v-for="(product, ind) in products" :key="ind">{{product.title}} - {{product.price | currency}} - {{ product.inventory }}
                <button @click="addProductToCart(product)" :disabled="!productIsInStock(product)">Add to cart</button>
            </li>


        </ul>

    </div>

</template>

<script>
    import shop from '../api/shop'

    export default {
        data () {
            return {
                loading: false
            }
        },

        computed: {
            products () {
                return this.$store.state.products;
            },

            productIsInStock () {
                return this.$store.getters.productIsInStock;
            }
        },

        methods: {
            addProductToCart(product) {
                this.$store.dispatch('addProductToCart', product)
            }
        },

        created () {
            console.log('here');

            this.loading = true;
            console.log(this.loading);
            this.$store.dispatch('fetchProducts').then(() => {
                this.loading = false
                console.log(this.loading);

            });

        }
    }
</script>

<style scoped>

</style>
