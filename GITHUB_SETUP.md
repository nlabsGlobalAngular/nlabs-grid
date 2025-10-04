# 🚀 GitHub Repository Setup Guide

Bu rehber, projenizi https://github.com/nlabsGlobalAngular/nlabs-grid repo'suna yüklemeniz için adım adım talimatlar içerir.

## 📋 Yapılması Gerekenler

### 1️⃣ Git Hazırlığı (Zaten yapıldı ✅)

Aşağıdaki dosyalar hazır ve commit edilmeye hazır:

✅ **Package.json** - Library formatına dönüştürüldü
✅ **.gitignore** - node_modules dahil edilmeyecek
✅ **.npmignore** - NPM publish için hazır
✅ **LICENSE** - MIT lisansı eklendi
✅ **README.md** - Profesyonel dokümantasyon
✅ **CONTRIBUTING.md** - Katkı rehberi
✅ **CHANGELOG.md** - Versiyon geçmişi
✅ **SECURITY.md** - Güvenlik politikası
✅ **GitHub Actions** - CI/CD pipeline
✅ **Issue Templates** - Bug report & Feature request
✅ **PR Template** - Pull request şablonu

### 2️⃣ Dosyaları Commit Etme

Terminalden şu komutları çalıştırın:

```powershell
# Mevcut dizinde olduğunuzdan emin olun
cd c:\Users\root\Desktop\angular-datagrid

# Tüm değişiklikleri stage'e ekleyin
git add .

# Commit yapın
git commit -m "feat: initial commit - @nlabs/grid library with full features

- Enterprise-grade DataGrid component
- Light/Dark theme system with auto mode
- Dual edit modes (inline + modal)
- CRUD operations with Turkish UI
- Export to Excel, CSV, PDF, JSON
- Advanced filtering, sorting, grouping
- Custom cell and footer templates
- Responsive design
- Complete documentation and examples
- CI/CD pipeline with GitHub Actions"

# Eğer daha önce bir remote eklemediyseniz:
git remote add origin https://github.com/nlabsGlobalAngular/nlabs-grid.git

# Eğer remote zaten varsa, URL'yi güncelleyin:
git remote set-url origin https://github.com/nlabsGlobalAngular/nlabs-grid.git

# Branch'i main olarak adlandırın (eğer master ise)
git branch -M main

# GitHub'a push edin
git push -u origin main
```

### 3️⃣ GitHub Repository Ayarları

Repository'yi GitHub'da oluşturduktan sonra:

#### Settings > General
- **Description:** Enterprise-grade Angular DataGrid component
- **Website:** (Demo URL eklenebilir)
- **Topics:** `angular`, `datagrid`, `grid`, `typescript`, `enterprise`, `ui-components`
- **Features:**
  - ✅ Issues
  - ✅ Discussions (isteğe bağlı)
  - ✅ Projects (isteğe bağlı)

#### Settings > Branches
- **Default branch:** main
- **Branch protection rules:** (Önerilen)
  - Require pull request reviews before merging
  - Require status checks to pass before merging

#### Settings > Secrets and variables > Actions
NPM'e publish etmek isterseniz:
- **NPM_TOKEN** ekleyin (https://www.npmjs.com/settings/~/tokens)

### 4️⃣ NPM Publish (İsteğe bağlı)

Paketi NPM'e yüklemek için:

```powershell
# NPM'e giriş yapın
npm login

# Paketi derleyin
npm run build:lib

# Paketi yayınlayın
npm publish --access public
```

Veya GitHub Actions ile otomatik publish için:
- Commit message'a `[publish]` ekleyin
- Örnek: `git commit -m "chore: release v1.0.0 [publish]"`

### 5️⃣ Repository Yapısı

```
nlabs-grid/
├── .github/
│   ├── workflows/
│   │   └── ci.yml                    # CI/CD pipeline
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md             # Bug report şablonu
│   │   └── feature_request.md        # Feature request şablonu
│   └── pull_request_template.md      # PR şablonu
├── src/
│   ├── data-grid/                    # Ana DataGrid component
│   ├── grid-template/                # Örnek kullanım
│   ├── interfaces/                   # TypeScript interfaces
│   └── services/                     # Services
├── .gitignore                        # Git ignore (node_modules dahil)
├── .npmignore                        # NPM ignore
├── CHANGELOG.md                      # Versiyon geçmişi
├── CONTRIBUTING.md                   # Katkı rehberi
├── LICENSE                           # MIT lisansı
├── package.json                      # Library package.json
├── README.md                         # Ana dokümantasyon
└── SECURITY.md                       # Güvenlik politikası
```

## ✅ Kontrol Listesi

Push etmeden önce kontrol edin:

- [ ] `package.json` içinde `@nlabs/grid` adı var
- [ ] `package.json` içinde repo URL'si doğru
- [ ] `.gitignore` içinde `node_modules` var
- [ ] `README.md` güncel ve eksiksiz
- [ ] `LICENSE` dosyası mevcut
- [ ] GitHub Actions workflow dosyaları hazır
- [ ] Commit message anlamlı

## 🎯 Sonraki Adımlar

Repository'yi yükledikten sonra:

1. **GitHub Actions'ı Kontrol Edin**
   - İlk push'tan sonra Actions sekmesini kontrol edin
   - CI pipeline'ın başarılı olduğundan emin olun

2. **README'yi GitHub'da Görüntüleyin**
   - Tüm badge'lerin çalıştığından emin olun
   - Görseller ve formatlamanın doğru göründüğünden emin olun

3. **Issues ve Discussions'ı Açın** (isteğe bağlı)
   - Kullanıcıların geri bildirim vermesi için

4. **NPM'e Publish Edin** (isteğe bağlı)
   - Diğer geliştiricilerin kullanması için

5. **Demo Yayınlayın** (isteğe bağlı)
   - GitHub Pages veya başka bir hosting
   - README'deki demo linkini güncelleyin

## 🤝 Ekip İçin Notlar

### Branch Stratejisi
```
main          - Production-ready code
develop       - Development branch (isteğe bağlı)
feature/*     - New features
bugfix/*      - Bug fixes
hotfix/*      - Urgent fixes
```

### Commit Convention
```
feat:     Yeni özellik
fix:      Bug fix
docs:     Dokümantasyon
style:    Code style (format)
refactor: Code refactoring
test:     Test ekleme/güncelleme
chore:    Maintenance
```

### Release Process
1. Update `CHANGELOG.md`
2. Update version in `package.json`
3. Commit: `git commit -m "chore: release vX.Y.Z"`
4. Tag: `git tag -a vX.Y.Z -m "Release vX.Y.Z"`
5. Push: `git push origin main --tags`
6. Publish: `npm publish` veya `[publish]` flag

## 📞 Yardım

Herhangi bir sorunla karşılaşırsanız:

**Cuma Köse**
- LinkedIn: https://www.linkedin.com/in/turkmvc/
- GitHub: https://github.com/turkmvc

---

**🎉 Başarılar! Projeniz artık GitHub'a yüklenmeye hazır!**
