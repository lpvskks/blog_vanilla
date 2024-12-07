async function fetchCommunityData(communityId) {
  try {
    const response = await fetch(`https://blog.kreosoft.space/api/community/${communityId}`);
    if (!response.ok) {
      throw new Error("Ошибка при загрузке данных о группе");
    }

    const communityData = await response.json();

    document.getElementById("community-name").textContent = communityData.name;
    document.getElementById("community-type").textContent = communityData.isClosed ? "Закрытое" : "Открытое";
    document.getElementById("subscriber-count").textContent = communityData.subscribersCount;

    const admin = communityData.administrators?.[0];
    if (admin) {
      const adminName = document.querySelector(".ms-2");
      adminName.textContent = admin.fullName;

      const adminImage = document.querySelector("img[alt='Администратор']");
      adminImage.src = admin.gender === "Female" ? "/src/images/girl.jpg" : "/src/images/man.jpg";
    } else {
      const adminContainer = document.querySelector(".mb-4");
      adminContainer.innerHTML = "<p class='text-muted'>Администратор не указан</p>";
    }
  } catch (error) {
    console.error("Ошибка при загрузке данных группы:", error);
  }
}

const communityId = window.location.pathname.split("/").pop();
fetchCommunityData(communityId);
