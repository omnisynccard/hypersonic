<script>
  async function init() {
   try {
      const response = await fetch('people.json');
      if (!response.ok) throw new Error('無法載入 people.json');
      const config = await response.json();

      const content = document.getElementById('content');
      content.innerHTML = '';

      const grid = document.createElement('div');
      grid.className = 'people-grid';

      config.people.forEach(person => {
        const card = document.createElement('a');
        card.className = 'person-card';
        card.href = `framework/?id=${person.id}`;
        card.innerHTML = `
          <img src="${person.assets.iconUrl}" alt="${person.name.zh}" class="person-avatar" 
               onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(person.name.en)}&size=200&background=1a3a5c&color=fff&bold=true'" />
          <div class="person-name">${person.name.zh}</div>
          <div class="person-title">${person.title}</div>
        `;
        grid.appendChild(card);
      });

      content.appendChild(grid);
    } catch (error) {
      console.error('初始化失敗:', error);
      document.getElementById('content').innerHTML = `
        <div class="error">
          <strong>載入失敗</strong><br>
          ${error.message}
        </div>
      `;
    }
  }

  document.addEventListener('DOMContentLoaded', init);
</script>
