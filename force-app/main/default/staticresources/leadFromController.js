    (function () {
      document.getElementById("companyContainer").style.display = "none";
    })();

    const selectElement = document.getElementById("00N7Q00000J5gwH");

    selectElement.addEventListener('change', (event) => {
      if (event.target.value == 'Business Premises') {
        document.getElementById("company").value = "";
        document.getElementById("companyContainer").style.display = "block";
        document.getElementById("recordType").value = '0127Q000001fzuZQAQ';
        
      }
      else if (event.target.value == 'Flats And Apartements') {
        document.getElementById("companyContainer").style.display = "none";
        document.getElementById("recordType").value = '0127Q000001fzueQAA';
        document.getElementById("company").value = "-";
      }
    });

function validateInputs(){
  console.log('vlidated')
}

    function submitForm( ){

    }