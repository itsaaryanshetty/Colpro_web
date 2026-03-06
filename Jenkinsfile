pipeline {
    agent any

    stages {

        stage('Clone Repo') {
            steps {
                echo 'Code pulled from GitHub ✅'
            }
        }

        stage('Setup ENV') {
            steps {
                withCredentials([file(credentialsId: 'colpro-env-file', variable: 'ENV_FILE')]) {
                    bat 'copy "%ENV_FILE%" backend_fastapi\\.env'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                bat 'docker build -t colpro-frontend ./frontend'
            }
        }

        stage('Build Backend') {
            steps {
                bat 'docker build -t colpro-backend ./backend_fastapi'
            }
        }

        stage('Stop Old Containers') {
            steps {
                bat 'docker-compose down'
            }
        }

        stage('Deploy') {
            steps {
                bat 'docker-compose up -d'
            }
        }
    }

    post {
        success {
            echo '✅ Colpro deployed successfully!'
        }
        failure {
            echo '❌ Build failed. Check Console Output.'
        }
    }
}