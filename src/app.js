document.addEventListener('alpine:init', () => {
    Alpine.data('products', () => ({
      items: [
        { id: 1, name: 'Training Adidas', img: '1.png', price: 20000, data: "pria", kategori: "celana"},
        { id: 2, name: 'Celana Anak Coklat', img: '2.png', price: 25000, data: "anak", kategori: "celana"},
        { id: 3, name: 'Celana Pria Kantor', img: '3.png', price: 30000, data: "pria", kategori: "celana"},
        { id: 4, name: 'Celana Pria panjang hitam', img: '4.png', price: 35000, data: "pria", kategori: "celana"},
        { id: 5, name: 'Flanel Pria', img: '5.png', price: 40000, data: "pria", kategori: "baju"},
        { id: 6, name: 'Jeans Wanita', img: '6.png', price: 40000, data: "wanita", kategori: "celana"},
        { id: 7, name: 'Kemeja Anak', img: '7.png', price: 40000, data: "anak", kategori: "baju"},
        { id: 8, name: 'Kemeja Hitam Pria', img: '8.png', price: 40000, data: "pria", kategori: "baju"},
        { id: 9, name: 'Krudung Polos', img: '9.png', price: 40000, data: "wanita", kategori: "krudung"},
        { id: 10, name: 'Krudung Motif', img: '10.png', price: 40000, data: "wanita", kategori: "krudung"},],
        showModal: false,
        selectedItem: {},
        showItemDetailModal(item) {
          this.selectedItem = item;
          this.showModal = true;
        },
        hideItemDetailModal() {
          this.showModal = false;
        },
    }));
  
    Alpine.store('cart', {
        items:[],
        total: 0,
        quantitiy: 0,
        add(newItem) {
            // cek apakah ada barang yang sama di cart
            const cartItem = this.items.find((item) => item.id === newItem.id);
  
            // jika belum ada / cart kosong
            if (!cartItem) {
                this.items.push({...newItem, quantitiy: 1, total: newItem.price });
                this.quantitiy++;
                this.total += newItem.price;
            } else {
                // jika barang sudah ada , cek apakah barang beda atau sama dengan ada di cart
                this.items = this.items.map((item) => {
                    // jika barang berbeda
                    if (item.id !== newItem.id) {
                        return item;
                    } else {
                        // jika barang sudah ada, tambah quantitiy dan totalnya
                        item.quantitiy++;
                        item.total = item.price * item.quantitiy;
                        this.quantitiy++;
                        this.total += newItem.price;
                        return item;
                    }
                });
            }
        },
        remove(id) {
            // ambil item yang mau diremove
            const cartItem = this.items.find((item) => item.id === id);
            // jika item lebih dari 1
            if (cartItem.quantitiy > 1) {
                // telusiri 1 1
                this.items = this.items.map((item) => {
                    // jika bukan barang yang diklik
                    if (item.id !== id) {
                        return item;
                    } else {
                        item.quantitiy--;
                        item.total = item.price * item.quantitiy;
                        this.quantitiy--;
                        this.total -= item.price;
                        return item;
                    }
                });
            } else if (cartItem.quantitiy === 1) {
                // jika barang sisa 1 
                this.items = this.items.filter((item) => item.id !== id);
                this.quantitiy--;
                this.total -= cartItem.price;
            }
  
        },
    });
  });
  
//   form validasi
const checkoutButton = document.querySelector('.checkout-button');
checkoutButton.disabled = true;

const form = document.querySelector('#checkoutForm');

form.addEventListener('keyup', function(){
    for(let i = 0; i < form.elements.length; i++){
        if(form.elements[i].value.length !==0){
            checkoutButton.classList.remove('disabled');
            checkoutButton.classList.add('disabled');
        } else {
            return false;
        }
    }
    checkoutButton.disabled = false;
    checkoutButton.classList.remove('disabled');
});

// kirim data ketika checkout
checkoutButton.addEventListener('click', function(e) {
    e.preventDefault();
    const formData = new FormData(form);
    const data = new URLSearchParams(formData);
    const objData = Object.fromEntries(data);
    const massage = formatMassage(objData);
    window.open('http://wa.me/6289652802457?text=' + encodeURIComponent(massage));
});


// format pesa wa
const formatMassage = (obj) => {
    return `Data Customer
        Nama: ${obj.name}
        Email: ${obj.email}
        No Hp: ${obj.phone}
Data Pesanan
    ${JSON.parse(obj.items).map((item) => `${item.name} (${item.quantitiy} X ${rupiah(item.total)}) \n`)}
    
TOTAL: ${rupiah(obj.total)} 
Terima kasih`;
};


  // konfrensi ke rupiah
  const rupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(number);
  };


  // Fungsi untuk melakukan pencarian produk
  function searchProducts() {
    // Ambil nilai dari input pencarian
    var searchTerm = document.getElementById('search-input').value.toLowerCase();
    
    // Ambil semua produk
    var products = document.querySelectorAll('.product-card');

    // Iterasi melalui setiap produk
    products.forEach(function(product) {
      // Ambil teks dari nama produk
      var productName = product.querySelector('.sub').innerText.toLowerCase();
      
      // Periksa apakah nama produk mengandung kata kunci pencarian
      if (productName.indexOf(searchTerm) === -1) {
        // Sembunyikan produk yang tidak sesuai dengan pencarian
        product.style.display = 'none';
      } else {
        // Tampilkan produk yang sesuai dengan pencarian
        product.style.display = 'block';
      }
    });
  }

  // Tangkap event submit form pencarian
  document.getElementById('search-form').addEventListener('submit', function(event) {
    // Mencegah pengiriman form
    event.preventDefault();
    // Panggil fungsi pencarian saat form disubmit
    searchProducts();
  });





