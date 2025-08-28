# Mobile App Conversion Prompt Template

Use this prompt when asking an AI agent to convert your web application to a React Native mobile app for app store deployment:

---

## **Prompt Template:**

```
Convert my existing web application to a React Native mobile app for iOS and Android app stores using Expo framework. Here are the requirements:

**Current Setup:**
- Web app built with [React/Next.js/Vue/etc.]
- Backend API at [your-backend-url]
- Key features: [list main features like authentication, data management, etc.]

**Mobile App Requirements:**
1. **Framework**: React Native with Expo for cross-platform development
2. **Navigation**: Expo Router for type-safe routing
3. **Styling**: NativeWind (Tailwind for React Native) to match web design
4. **State Management**: TanStack Query for API data, AsyncStorage for local data
5. **Deployment**: Ready for Expo Launch and EAS Build for app stores

**Key Features to Convert:**
- [Feature 1: e.g., User authentication]
- [Feature 2: e.g., Main dashboard/interface] 
- [Feature 3: e.g., Data export/sharing]
- [Feature 4: e.g., Any special functionality]

**Structure Needed:**
```
mobile/
├── app/                 # Expo Router screens
│   ├── _layout.tsx     # Root navigation
│   ├── index.tsx       # Main/landing screen
│   └── [other-screens] # Feature screens
├── lib/
│   └── api.ts          # Backend integration
├── assets/             # App icons and images
├── package.json        # Mobile dependencies
├── app.json           # Expo configuration
└── eas.json           # App store build config
```

**App Store Deployment:**
- Generate professional app icon (1024x1024)
- Configure EAS build for iOS and Android
- Set up proper bundle identifiers and app metadata
- Create deployment documentation

**Backend Integration:**
- Reuse existing API endpoints: [list main endpoints]
- Handle authentication: [describe auth method]
- Maintain data consistency between web and mobile

**Additional Requirements:**
- Mobile-optimized UI with touch-friendly controls
- Native navigation patterns
- App store submission ready
- Professional app assets and metadata

Please create a complete mobile app that works with Expo Launch and is ready for app store deployment.
```

---

## **Customization Tips:**

### **For Different Web Framework:**
- **React**: "Convert my React web app..."
- **Next.js**: "Convert my Next.js web app..."
- **Vue**: "Convert my Vue.js web app to React Native..."

### **For Different Backend:**
- **REST API**: "Backend API with REST endpoints at..."
- **GraphQL**: "GraphQL backend at..."
- **Firebase**: "Firebase backend with..."
- **Supabase**: "Supabase backend with..."

### **For Specific Features:**
```
**Special Features:**
- Voice interaction using Web Speech API
- File upload with document parsing
- Real-time chat/messaging
- Push notifications
- Offline data sync
- Camera/photo functionality
```

### **For Authentication:**
```
**Authentication:**
- JWT tokens with [provider]
- OAuth with [Google/Apple/etc.]
- Session-based auth
- Custom user management
```

---

## **Example Filled Prompt:**

```
Convert my existing Socratic thinking coach web application to a React Native mobile app for iOS and Android app stores using Expo framework.

**Current Setup:**
- Web app built with React + Express backend
- Backend API at https://my-app.replit.app
- Features: AI-powered questioning, voice interaction, conversation history, export functionality

**Mobile App Requirements:**
1. Framework: React Native with Expo
2. Navigation: Expo Router
3. Styling: NativeWind matching web design
4. State: TanStack Query + AsyncStorage
5. Deployment: Expo Launch + EAS Build ready

**Key Features to Convert:**
- User authentication with session management
- Socratic questioning interface with AI responses
- Voice-to-text and text-to-speech capabilities  
- Conversation history and threading
- Export functionality (download, email, copy)

**Backend Integration:**
- API endpoints: /api/auth, /api/conversations, /api/generate
- Anthropic Claude AI integration
- PostgreSQL database with conversation storage

Please create a complete mobile app ready for app store deployment with professional assets.
```

---

## **Success Factors:**

✅ **Be specific about your current tech stack**
✅ **List exact features to convert** 
✅ **Mention backend URL and key endpoints**
✅ **Request app store deployment readiness**
✅ **Ask for professional app assets**
✅ **Specify Expo Launch compatibility**

This prompt template will help agents understand exactly what you need for a successful mobile conversion!