#!/bin/bash

echo "🚛 TowOps Free Tier Setup Script"
echo "================================"

# Check if we're in the right directory
if [ ! -f "apps/web/package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "📦 Installing dependencies..."
cd apps/web
npm install

echo ""
echo "🔧 Setting up environment..."
if [ ! -f ".env.local" ]; then
    echo "📝 Creating .env.local from example..."
    cp ../../config/example.env .env.local
    echo "✅ Created .env.local - please update with your Firebase credentials"
else
    echo "✅ .env.local already exists"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update apps/web/.env.local with your Firebase project credentials"
echo "2. Add your OpenAI API key (optional) for AI features"
echo "3. Run 'npm run dev' to start the development server"
echo ""
echo "The app will work with or without Firebase configuration - it will use local storage as fallback."
echo ""
echo "Available features:"
echo "• Dispatch Management (/dispatch)"
echo "• Mobile Driver App (/mobile)" 
echo "• NSV QA System (/nsv)"
echo "• Reports & Analytics (/reports)"
echo "• AI Support Chat (floating widget)"
