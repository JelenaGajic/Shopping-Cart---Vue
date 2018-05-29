<template>
    <div>
        <h1>Shopping Cart</h1>

        <ul>
            <li v-for="(product, ind) in products" :key="ind">
                {{ product.title }} - {{ product.price | currency }} - {{ product.quantity }}
            </li>
        </ul>
        <p>Cart total is: {{ total | currency }}</p>

        <button @click="$store.dispatch('checkout')" :disabled="total === 0">Checkout</button>
        <p v-if="!this.$store.state.checkoutStatus">{{this.$store.state.checkoutStatus}}</p>
    </div>
</template>

<script>
    export default {
        computed: {
            products () {
                return this.$store.getters.cartProducts;
            },

            total () {
                return this.$store.getters.cartTotal;
            }
        }
    }
</script>

<style scoped>

</style>
