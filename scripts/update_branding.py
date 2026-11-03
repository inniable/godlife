import os

# 1. page.tsx
p_page = r'c:\Users\82108\Desktop\antigravity\src\app\page.tsx'
with open(p_page, 'r', encoding='utf-8') as f:
    c = f.read()
c = c.replace('GoalMate 불러오는 중...', '갓생살기 불러오는 중...')
c = c.replace('>GoalMate<', '>갓생살기<')
c = c.replace('GoalMate\n', '갓생살기\n')
c = c.replace('Low Cognitive Load Tracker', '부담 없는 하루 목표 & 습관 트래커')
with open(p_page, 'w', encoding='utf-8') as f:
    f.write(c)

# 2. layout.tsx
p_layout = r'c:\Users\82108\Desktop\antigravity\src\app\layout.tsx'
with open(p_layout, 'r', encoding='utf-8') as f:
    c = f.read()
c = c.replace("title: 'GoalMate | Z세대를 위한 일정 & 목표 수치 트래킹'", "title: '갓생살기 | 하루 목표 & 습관 트래커'")
c = c.replace("description: '운동량, 공부 시간, 일상을 최소 뎁스로 기록하고 공유하는 Z세대 일정 & 목표 트래커'", "description: '부담 없이 기록하고 공유하는 Z세대 하루 목표 & 습관 트래커'")
c = c.replace("title: 'GoalMate'", "title: '갓생살기'")
with open(p_layout, 'w', encoding='utf-8') as f:
    f.write(c)

# 3. ShareCardModal.tsx
p_share = r'c:\Users\82108\Desktop\antigravity\src\components\share\ShareCardModal.tsx'
with open(p_share, 'r', encoding='utf-8') as f:
    c = f.read()
c = c.replace('GoalMate ✨', '갓생살기 ✨')
c = c.replace('goalmate.app', '#갓생살기 #오늘도성공')
c = c.replace('GoalMate_${selectedDate}.png', '갓생살기_${selectedDate}.png')
with open(p_share, 'w', encoding='utf-8') as f:
    f.write(c)

# 4. capacitor.config.ts
p_cap = r'c:\Users\82108\Desktop\antigravity\capacitor.config.ts'
with open(p_cap, 'r', encoding='utf-8') as f:
    c = f.read()
c = c.replace("appName: 'GoalMate'", "appName: '갓생살기'")
with open(p_cap, 'w', encoding='utf-8') as f:
    f.write(c)

# 5. strings.xml (Android)
p_str = r'c:\Users\82108\Desktop\antigravity\android\app\src\main\res\values\strings.xml'
if os.path.exists(p_str):
    with open(p_str, 'r', encoding='utf-8') as f:
        c = f.read()
    c = c.replace('<string name=\"app_name\">GoalMate</string>', '<string name=\"app_name\">갓생살기</string>')
    c = c.replace('<string name=\"title_activity_main\">GoalMate</string>', '<string name=\"title_activity_main\">갓생살기</string>')
    with open(p_str, 'w', encoding='utf-8') as f:
        f.write(c)

print('All branding updated to 갓생살기!')
