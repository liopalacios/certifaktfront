pipeline {
  agent {
    docker {
      image 'node:10-alpine'
      args '-p 20001-20100:3000'
    }

  }
  stages {
    stage('Install package') {
      steps {
        sh 'npm install'
      }
    }
    stage('Build artifact') {
      steps {
        sh 'npm run build --prod'
      }
    }
    stage('Deploy aws s3') {
      when {
        branch 'master'
      }
      steps {
        withAWS(credentials: 'jenkins-aws-user', region: 'us-west-2') {
          s3Delete(bucket: 'certifakthosting', path: 'dist/')
          s3Upload(bucket: 'certifakthosting', acl: 'PublicRead', path: 'dist/', includePathPattern: '**/*', workingDir: 'dist')
          cfInvalidate(paths: ['/*'], distribution: 'E237AQ3ELCXU0I')
        }
      }
    }
  }
  environment {
    CI = 'true'
    HOME = '.'
    npm_config_cache = 'npm-cache'
  }
}
