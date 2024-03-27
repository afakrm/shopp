$(document).ready(function() {
    // Appel initial pour mettre à jour les montants
    updateAmounts();

    // Événements déclenchés lors de la saisie dans les champs de quantité et de prix
    $('.qty, .price').on('keyup keypress blur change', function(e) {
        updateAmounts(); // Met à jour les montants
    });

    // Événement déclenché lors de la saisie dans le champ de recherche
    $('#searchInput').on('keyup', function() {
        var searchText = $(this).val().toLowerCase(); // Récupère le texte saisi et le convertit en minuscules
        $('#myTable tbody tr').each(function() { // Parcourt chaque ligne du tableau
            var name = $(this).find('td:nth-child(2)').text().toLowerCase(); // Récupère le nom du produit et le convertit en minuscules
            if (name.includes(searchText)) {
                $(this).show(); // Affiche la ligne si le nom du produit correspond au texte saisi
            } else {
                $(this).hide(); // Sinon, masque la ligne
            }
        });
    });

    // Fonction pour mettre à jour les montants
    function updateAmounts() {
        var sum = 0.0; // Initialise la somme à 0
        $('#myTable > tbody > tr:visible').each(function() { // Parcourt chaque ligne visible du tableau
            var qty = parseFloat($(this).find('.qty').val()); // Récupère la quantité saisie
            var price = parseFloat($(this).find('.price').val()); // Récupère le prix
            var amount = qty * price; // Calcule le montant
            sum += amount; // Ajoute le montant à la somme totale
            $(this).find('.amount').text(amount.toFixed(2)); // Affiche le montant dans la colonne correspondante
        });
        $('.total').text(sum.toFixed(2)); // Affiche la somme totale
    }

    // Gestion de l'incrémentation de la quantité
    $('.cart-qty-plus').click(function() {
        var $qty = $(this).siblings(".qty"); // Récupère le champ de quantité correspondant
        var qtyVal = parseFloat($qty.val()); // Récupère la valeur de la quantité
        $qty.val(qtyVal + 1); // Incrémente la quantité
        updateAmounts(); // Met à jour les montants
    });

    // Gestion de la décrémentation de la quantité
    $('.cart-qty-minus').click(function() {
        var $qty = $(this).siblings(".qty"); // Récupère le champ de quantité correspondant
        var qtyVal = parseFloat($qty.val()); // Récupère la valeur de la quantité
        if (qtyVal > 0) {
            $qty.val(qtyVal - 1); // Décrémente la quantité si elle est supérieure à zéro
            updateAmounts(); // Met à jour les montants
        }
    });

    // Gestion de l'envoi de la commande à Google Sheets
    $('#submitOrderBtn').click(function() {
        var customerName = $('#customerName').val(); // Récupère le nom du client
        var totalAmount = parseFloat($('.total').text()); // Récupère le montant total

        // Validation des données
        if (customerName === "") {
            alert("Veuillez entrer votre nom.");
            return; // Arrête la fonction si le nom du client est vide
        }

        // Envoi des données à Google Sheets via AJAX
        $.ajax({
            url: 'https://script.google.com/macros/s/AKfycbwG9O0OfkYr-ZdehEL8turz8oqFP_0VcimYzNHGEsrnGRqRzmhdYXBXQ3_xjb9Z8mBe/exec',
            method: 'POST',
            dataType: 'json',
            data: {
                name: customerName,
                total: totalAmount
            },
            success: function(response) {
                // Gérer la réponse réussie
                console.log(response);
                alert("Votre commande a été envoyée avec succès !");
            },
            error: function(error) {
                // Gérer l'erreur
                console.error('Erreur lors de l\'envoi de la commande:', error);
                alert("Une erreur est survenue lors de l'envoi de votre commande. Veuillez réessayer plus tard.");
            }
        });
    });
});
