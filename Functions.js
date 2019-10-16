function getColor(colorCode){
  let color = "";
  switch(colorCode){
    case 1:
      color = "cyan";
      break;
    case 2:
      color = "yellow";
      break;
    case 3:
      color = "purple";
      break;
    case 4:
      color = "blue";
      break;
    case 5:
      color = "orange";
        break;
    case 6:
      color = "green";
        break;
    case 7:
      color = "red";
        break;
  }
  return color;
}

  function swapArrayValues(arr,a,b){
    let tempA = arr[a];
    arr[a] = arr[b];
    arr[b] = tempA;
  }
