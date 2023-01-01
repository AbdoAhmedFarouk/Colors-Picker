let colorPicker = document.getElementById("color-picker");
let ul = document.querySelector(".all-colors");
let clearAll = document.querySelector(".clear-all");
let pickedColors = JSON.parse(localStorage.getItem("picked-colors") || "[]");

let copyColor = (ele) => {
  navigator.clipboard.writeText(ele.dataset.color);
  ele.innerText = "Copied";
  setTimeout(() => (ele.innerText = ele.dataset.color), 1000);
};

let showColors = () => {
  if (!pickedColors.length) return;
  ul.innerHTML = pickedColors
    .map(
      (color) => `
      <li class="color">
        <span class="rect" style="background: ${color}; border: 1px solid ${
        color == "#ffffff" ? "#ccc" : color
      }"></span>
        <span class="value" data-color="${color}">${color}</span>
      </li>
    `
    )
    .join("");
  document.querySelector(".picked-colors").classList.remove("hide");
  document.querySelectorAll(".color").forEach((li) => {
    li.addEventListener("click", (e) =>
      copyColor(e.currentTarget.lastElementChild)
    );
  });
};

showColors();

let activateEyeDropper = () => {
  document.body.style.display = "none";
  setTimeout(async () => {
    try {
      let eyeDropper = new EyeDropper();
      let { sRGBHex } = await eyeDropper.open();
      navigator.clipboard.writeText(sRGBHex);
      if (!pickedColors.includes(sRGBHex)) {
        pickedColors.push(sRGBHex);
        localStorage.setItem("picked-colors", JSON.stringify(pickedColors));
        showColors();
      }
    } catch (e) {
      console.log("Failed to copy the color code!");
    }
    document.body.style.display = "flex";
  }, 10);
};

let ClearAllColors = () => {
  pickedColors.length = 0;
  localStorage.setItem("picked-colors", JSON.stringify(pickedColors));
  document.querySelector(".picked-colors").classList.add("hide");
};

colorPicker.addEventListener("click", activateEyeDropper);
clearAll.addEventListener("click", ClearAllColors);