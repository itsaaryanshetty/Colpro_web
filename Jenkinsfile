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
                bat 'docker save colpro-frontend | gzip > colpro-frontend.tar.gz'
                bat 'docker save colpro-backend | gzip > colpro-backend.tar.gz'
            }
        }

        stage('Transfer to EC2') {
            steps {
                withCredentials([sshUserPrivateKey(credentialsId: 'ec2-ssh-key', keyFileVariable: 'SSH_KEY')]) {
                    bat '''
                        scp -i "%SSH_KEY%" -o StrictHostKeyChecking=no colpro-frontend.tar.gz %EC2_USER%@%EC2_IP%:~/
                        scp -i "%SSH_KEY%" -o StrictHostKeyChecking=no colpro-backend.tar.gz %EC2_USER%@%EC2_IP%:~/
                        scp -i "%SSH_KEY%" -o StrictHostKeyChecking=no docker-compose.yml %EC2_USER%@%EC2_IP%:~/
                        scp -i "%SSH_KEY%" -o StrictHostKeyChecking=no backend_fastapi/.env %EC2_USER%@%EC2_IP%:~/
                    '''
                }
            }
        }

        stage('Deploy on EC2') {
            steps {
                withCredentials([sshUserPrivateKey(credentialsId: 'ec2-ssh-key', keyFileVariable: 'SSH_KEY')]) {
                    bat '''
                        ssh -i "%SSH_KEY%" -o StrictHostKeyChecking=no %EC2_USER%@%EC2_IP% "
                            docker load < colpro-frontend.tar.gz &&
                            docker load < colpro-backend.tar.gz &&
                            docker-compose down &&
                            docker-compose up -d
                        "
                    '''
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