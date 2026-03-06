pipeline {
    agent any

    stages {

        stage('Clone Repo') {
            steps {
                echo 'Code pulled from GitHub ✅'
            }
        }

        stage('Build Frontend') {
            steps {
                sh 'docker build -t colpro-frontend ./frontend'
            }
        }

        stage('Build Backend') {
            steps {
                sh 'docker build -t colpro-backend ./backend_fastapi'
            }
        }

        stage('Stop Old Containers') {
            steps {
                sh 'docker-compose down'
            }
        }

        stage('Deploy') {
            steps {
                sh 'docker-compose up -d'
            }
        }
    }

    post {
        success {
            echo 'Colpro deployed successfully!'
        }
        failure {
            echo 'Build failed. Check Console Output.'
        }
    }
}