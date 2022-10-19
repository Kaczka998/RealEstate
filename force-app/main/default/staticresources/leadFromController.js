    (function () {
      document.getElementById("companyC").style.display = "none";
    })();

    const selectElement = document.getElementById("00N7Q00000DXaY9");

    selectElement.addEventListener('change', (event) => {
      if (event.target.value == 'Business Premises') {
        document.getElementById("company").value = "";
        document.getElementById("companyC").style.display = "block";
        document.getElementById("recordType").value = '0127Q000000EsLoQAK';
    
        
      }
      else if (event.target.value == 'Flats' || event.target.value == 'Apartments') {
        document.getElementById("companyC").style.display = "none";
        document.getElementById("recordType").value = '0127Q000000EsLyQA';
        document.getElementById("company").value = "-";
      }
    });

function validateInputs(){
  console.log(document.getElementById("recordType").value)
}

    function submitForm( ){

    }