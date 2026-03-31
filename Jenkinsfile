pipeline {
    agent any

    environment {
        EC2_IP = '65.2.107.195'
        EC2_USER = 'ubuntu'
    }

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
                bat 'docker build --no-cache -t colpro-frontend ./frontend'
            }
        }

        stage('Build Backend') {
            steps {
                bat 'docker build --no-cache -t colpro-backend ./backend_fastapi'
            }
        }

        stage('Save Docker Images') {
            steps {
                bat 'docker save -o colpro-frontend.tar colpro-frontend'
                bat 'docker save -o colpro-backend.tar colpro-backend'
            }
        }

        stage('Transfer to EC2') {
            steps {
                withCredentials([sshUserPrivateKey(credentialsId: 'ec2-ssh-key', keyFileVariable: 'SSH_KEY')]) {
                    bat 'scp -i "%SSH_KEY%" -o StrictHostKeyChecking=no colpro-frontend.tar %EC2_USER%@%EC2_IP%:~/'
                    bat 'scp -i "%SSH_KEY%" -o StrictHostKeyChecking=no colpro-backend.tar %EC2_USER%@%EC2_IP%:~/'
                    bat 'scp -i "%SSH_KEY%" -o StrictHostKeyChecking=no docker-compose.yml %EC2_USER%@%EC2_IP%:~/'
                    bat 'scp -i "%SSH_KEY%" -o StrictHostKeyChecking=no backend_fastapi\\.env %EC2_USER%@%EC2_IP%:~/'
                }
            }
        }

        stage('Deploy on EC2') {
            steps {
                withCredentials([sshUserPrivateKey(credentialsId: 'ec2-ssh-key', keyFileVariable: 'SSH_KEY')]) {
                    bat 'ssh -i "%SSH_KEY%" -o StrictHostKeyChecking=no %EC2_USER%@%EC2_IP% "docker load -i colpro-frontend.tar && docker load -i colpro-backend.tar && docker-compose down && docker-compose up -d"'
                }
            }
        }
    }

    post {
        success {
            echo '✅ Colpro deployed to EC2 successfully!'
        }
        failure {
            echo '❌ Build failed. Check Console Output.'
        }
    }
}