1. ## Homepage:

- visualizzazione di almeno due sezioni di prodotti (3 prodotti in promozione e 3 più acquistati)

> ### Routes = INDEX (Homepage) | STORE (NewsLetters)

2. ## Pagina di ricerca

- barra di ricerca con opzioni di ordinamento (prezzo, nome, recenti)
- visualizzazione dei risultati di ricerca

> ### Routes = INDEX

3. ## Pagina di dettaglio prodotto

- visualizzazione delle informazioni del prodotto
- possibilità di aggiungere il prodotto al carrello

> ### Routes = SHOW

4. ## Carrello

- possibilità di modificare le quantità dei prodotti nel carrello
- visualizzare il totale del carrello

> ### Routes = INDEX (Mostra videogiochi da acquistati) | STORE (Inserimento ordine con stato `Da Pagare`)

5. ## Checkout

- inserimento dei dati di fatturazione e spedizione del cliente
- riepilogo dell’ordine con il totale

> ### Routes = INDEX (Mostra il riepilogo ordine fatto nel punto 4) | UPDATE (invia i dati Shipping, Billing e cambiamento dello stato ordine in `Pagato`)

> #### Se vogliamo fare gli sbruffoni: Se presente la `digital_copy_code` lo stato passa a "Consegnato" se no lo stato diventa "Spedito"

---

# Milestones extra

3. ## Wishlist

- aggiunta/rimozione prodotti da una lista dei desideri
- visualizzazione della lista in una pagina dedicata

> ### Routes = INDEX

4. ## Prodotti correlati

- visualizzare i prodotti correlati nella pagina di dettaglio di un prodotto

> ### Routes = SHOW

5. ## Pop-up di benvenuto

- mostrare un pop-up di benvenuto solamente durante la prima visita dell’utente
- permettere di raccogliere l’e-mail del visitatore
- inviare un’e-mail di ringraziamento
